package cz.hostingcentrum.Service;

import cz.hostingcentrum.DTO.CreateProjectDTO;
import cz.hostingcentrum.DTO.ProjectDTO;
import cz.hostingcentrum.Enum.SubscriptionStatus;
import cz.hostingcentrum.Interface.ProjectService;
import cz.hostingcentrum.Model.Project;
import cz.hostingcentrum.Model.Subscription;
import cz.hostingcentrum.Model.User;
import cz.hostingcentrum.Repository.ProjectRepository;
import cz.hostingcentrum.Repository.SubscriptionRepo;
import cz.hostingcentrum.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private static final Pattern FQDN_PATTERN = Pattern.compile(
            "^(?=.{1,253}$)(?:(?!-)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+(?:[a-z]{2,63})$"
    );

    private final ProjectRepository projectRepository;
    private final UserRepo userRepo;
    private final SubscriptionRepo subscriptionRepo;

    @Value("${app.customers-path:/srv/customers}")
    private String customersPath;

    @Value("${app.apache.vhosts-dir:/srv/apache/vhosts.d}")
    private String apacheVhostsDir;

    @Value("${app.apache.vhost-filename-pattern:project-%s.conf}")
    private String apacheVhostFilenamePattern;

    @Value("${app.apache.reload-command:apachectl -k graceful}")
    private String apacheReloadCommand;

    @Override
    public ProjectDTO createProject(CreateProjectDTO dto) {
        User user = getCurrentUser();

        Subscription activeSub = subscriptionRepo
                .findByUserId(user.getId())
                .stream()
                .filter(s -> s.getStatus() == SubscriptionStatus.active)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No active subscription"));

        long currentCount = projectRepository.countByUserId(user.getId());
        int maxProjects = activeSub.getPlan().getMaxProjects();
        if (currentCount >= maxProjects) {
            throw new RuntimeException("Project limit exceeded for this user");
        }

        String normalizedDomain = normalizeAndValidateDomain(dto.getDomain());
        assertDomainIsAvailable(normalizedDomain);

        String runtime = normalizeRuntime(dto.getRuntime());
        String documentRoot = buildDocumentRoot(user.getId());

        Project saved = projectRepository.save(Project.builder()
                .user(user)
                .projectName(buildProjectNameFromDomain(normalizedDomain))
                .domain(normalizedDomain)
                .documentRoot(documentRoot)
                .runtime(runtime)
                .publicationStatus("draft")
                .provisioningError(null)
                .isActive(Boolean.TRUE)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        return mapToDto(saved);
    }

    @Override
    public List<ProjectDTO> getCurrentUserProjects() {
        User user = getCurrentUser();
        return projectRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public void deleteProject(Long projectId) {
        Project project = getOwnedProject(projectId);
        projectRepository.delete(project);
    }

    @Override
    public ProjectDTO publishProject(Long projectId) {
        Project project = getOwnedProject(projectId);
        try {
            validatePublishableDocumentRoot(project);
            validateProjectIdentityForFilesystem(project);

            String vhostConfig = renderVhostConfig(project);
            writeOrUpdateVhostConfig(project, vhostConfig);
            reloadApacheGracefully();

            project.setPublicationStatus("published");
            project.setProvisioningError(null);
            project.setUpdatedAt(LocalDateTime.now());
            project.setIsActive(Boolean.TRUE);

            return mapToDto(projectRepository.save(project));
        } catch (RuntimeException ex) {
            markProjectProvisioningFailed(project, ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            markProjectProvisioningFailed(project, ex.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Publishing failed during Apache provisioning.", ex);
        }
    }

    @Override
    public ProjectDTO redeployProject(Long projectId) {
        Project project = getOwnedProject(projectId);

        if (!"published".equalsIgnoreCase(project.getPublicationStatus())) {
            throw new RuntimeException("Project must be published before redeploy");
        }

        project.setUpdatedAt(LocalDateTime.now());
        return mapToDto(projectRepository.save(project));
    }

    private ProjectDTO mapToDto(Project project) {
        return ProjectDTO.builder()
                .id(project.getId())
                .userId(project.getUser().getId())
                .domain(project.getDomain())
                .documentRoot(project.getDocumentRoot())
                .runtime(project.getRuntime())
                .publicationStatus(project.getPublicationStatus())
                .provisioningError(project.getProvisioningError())
                .build();
    }

    private String normalizeRuntime(String runtime) {
        if (runtime == null) {
            throw new RuntimeException("Runtime is required");
        }
        String normalized = runtime.toLowerCase(Locale.ROOT);
        if (!normalized.equals("static") && !normalized.equals("php")) {
            throw new RuntimeException("Runtime must be static or php");
        }
        return normalized;
    }

    private Project getOwnedProject(Long projectId) {
        User currentUser = getCurrentUser();
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        if (!project.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot access another user's project");
        }
        return project;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        return userRepo.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private String buildDocumentRoot(Long userId) {
        Path webRoot = Paths.get(customersPath, "user_" + userId, "www");
        return webRoot.normalize().toString();
    }

    private void validatePublishableDocumentRoot(Project project) {
        String documentRoot = project.getDocumentRoot();
        if (documentRoot == null || documentRoot.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Project cannot be published: document root is not configured.");
        }

        Path indexFile = Paths.get(documentRoot, "index.html").normalize();
        if (!Files.exists(indexFile) || !Files.isRegularFile(indexFile)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Project cannot be published: missing index.html in " + documentRoot + ".");
        }
    }

    private String normalizeAndValidateDomain(String domain) {
        if (domain == null || domain.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Domain is required");
        }

        String normalized = domain.trim().toLowerCase(Locale.ROOT);
        if (containsPathTraversalPayload(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Domain contains invalid path traversal characters");
        }
        if (!FQDN_PATTERN.matcher(normalized).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Domain must be a valid FQDN");
        }
        return normalized;
    }

    private void assertDomainIsAvailable(String domain) {
        if (projectRepository.existsByDomainIgnoreCase(domain)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Domain is already used by another project");
        }
    }

    private String buildProjectNameFromDomain(String domain) {
        String name = domain.replace('.', '-');
        if (containsPathTraversalPayload(name)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Project name derived from domain is not safe");
        }
        return name;
    }

    private void validateProjectIdentityForFilesystem(Project project) {
        if (containsPathTraversalPayload(project.getDomain()) || containsPathTraversalPayload(project.getProjectName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Project contains invalid domain/name values for filesystem provisioning");
        }
    }

    private boolean containsPathTraversalPayload(String value) {
        if (value == null) {
            return false;
        }
        return value.contains("..")
                || value.contains("/")
                || value.contains("\\")
                || value.contains("\u0000");
    }

    private String renderVhostConfig(Project project) {
        String safeDomain = normalizeAndValidateDomain(project.getDomain());
        String safeDocumentRoot = Paths.get(project.getDocumentRoot()).normalize().toString();

        return "<VirtualHost *:80>\n"
                + "    ServerName " + safeDomain + "\n"
                + "    DocumentRoot \"" + safeDocumentRoot + "\"\n\n"
                + "    <Directory \"" + safeDocumentRoot + "\">\n"
                + "        Options Indexes FollowSymLinks\n"
                + "        AllowOverride All\n"
                + "        Require all granted\n"
                + "    </Directory>\n\n"
                + "    ErrorLog /proc/self/fd/2\n"
                + "    CustomLog /proc/self/fd/1 combined\n"
                + "</VirtualHost>\n";
    }

    private void writeOrUpdateVhostConfig(Project project, String content) {
        try {
            Path configDir = Paths.get(apacheVhostsDir).normalize();
            Files.createDirectories(configDir);

            String safeProjectName = project.getProjectName().replaceAll("[^a-zA-Z0-9-]", "-");
            String fileName = String.format(apacheVhostFilenamePattern, safeProjectName);
            if (containsPathTraversalPayload(fileName)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Generated Apache config filename is not safe");
            }

            Path outputFile = configDir.resolve(fileName).normalize();
            if (!outputFile.startsWith(configDir)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Resolved Apache config path escapes target directory");
            }

            Files.writeString(outputFile, content, StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Cannot write Apache VirtualHost configuration", e);
        }
    }

    private void reloadApacheGracefully() {
        try {
            Process process = new ProcessBuilder("sh", "-c", apacheReloadCommand)
                    .redirectErrorStream(true)
                    .start();

            String output = new String(process.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                        "Apache graceful reload failed: " + output);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Apache reload was interrupted", e);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Cannot execute Apache reload command", e);
        }
    }

    private void markProjectProvisioningFailed(Project project, String errorMessage) {
        project.setPublicationStatus("failed");
        project.setProvisioningError(errorMessage == null ? "Unknown provisioning error" : errorMessage);
        project.setUpdatedAt(LocalDateTime.now());
        projectRepository.save(project);
    }
}
