package cz.hostingcentrum.Service;

import cz.hostingcentrum.Config.EncryptedKeyService;
import cz.hostingcentrum.DTO.CreateProjectDTO;
import cz.hostingcentrum.DTO.ProjectDTO;
import cz.hostingcentrum.DTO.ProjectFileDto;
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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.PosixFilePermission;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.Set;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private static final Pattern HOST_PATTERN = Pattern.compile("^(?=.{1,253}$)(?!-)[a-z0-9][a-z0-9.-]*[a-z0-9]$");
    private static final Pattern SAFE_UPLOAD_FILENAME = Pattern.compile("^[a-zA-Z0-9._-]{1,128}$");

    private final ProjectRepository projectRepository;
    private final UserRepo userRepo;
    private final SubscriptionRepo subscriptionRepo;
    private final EncryptedKeyService encryptedKeyService;

    @Value("${app.customers-path:/srv/customers}")
    private String customersPath;

    @Value("${app.apache.vhosts-dir:/srv/apache/vhosts.d}")
    private String apacheVhostsDir;

    @Value("${app.apache.vhost-filename-pattern:project-%s.conf}")
    private String apacheVhostFilenamePattern;

    @Value("${app.apache.validate-command:httpd -t}")
    private String apacheValidateCommand;

    @Value("${app.apache.reload-command:apachectl -k graceful}")
    private String apacheReloadCommand;

    @Value("${app.ftp.host:localhost}")
    private String ftpHost;

    @Value("${app.ftp.port:21}")
    private Integer ftpPort;

    @Override
    public ProjectDTO createProject(CreateProjectDTO dto) {
        User user = getCurrentUser();
        Subscription activeSub = getActiveSubscription(user.getId());

        String normalizedDomain = normalizeAndValidateHost(dto.getDomain());
        assertDomainIsAvailable(normalizedDomain);

        String projectName = normalizeProjectName(dto.getName());
        String slug = slugify(projectName);
        String webRoot = buildProjectWebRoot(user.getId(), slug);
        String ftpUsername = buildFtpUsername(user.getId(), slug);
        String ftpPassword = generateProvisionedSecret();

        Project project = Project.builder()
                .user(user)
                .plan(activeSub.getPlan())
                .projectName(projectName)
                .slug(slug)
                .domain(normalizedDomain)
                .documentRoot(webRoot)
                .runtime("static")
                .publicationStatus("provisioning")
                .ftpHost(ftpHost)
                .ftpPort(ftpPort)
                .ftpUsername(ftpUsername)
                .ftpPasswordEncrypted(encryptedKeyService.encrypt(ftpPassword))
                .provisioningError(null)
                .isActive(Boolean.FALSE)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Project saved = projectRepository.save(project);

        try {
            provisionProject(saved);
            saved.setPublicationStatus("active");
            saved.setIsActive(Boolean.TRUE);
            saved.setProvisioningError(null);
            saved.setUpdatedAt(LocalDateTime.now());
            return mapToDto(projectRepository.save(saved));
        } catch (Exception ex) {
            saved.setPublicationStatus("failed");
            saved.setProvisioningError(ex.getMessage());
            saved.setUpdatedAt(LocalDateTime.now());
            projectRepository.save(saved);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Provisioning failed: " + ex.getMessage());
        }
    }

    @Override
    public List<ProjectDTO> getCurrentUserProjects() {
        User user = getCurrentUser();
        return projectRepository.findByUserId(user.getId()).stream().map(this::mapToDtoWithoutSecrets).toList();
    }

    @Override
    public ProjectDTO getCurrentUserProject(Long projectId) {
        Project project = getOwnedProject(projectId);
        return mapToDto(project);
    }

    @Override
    public List<ProjectFileDto> listProjectFiles(Long projectId) {
        Project project = getOwnedProject(projectId);
        Path webRootPath = getProjectWebRootPath(project);

        try {
            if (!Files.exists(webRootPath)) {
                return List.of();
            }

            try (Stream<Path> pathStream = Files.list(webRootPath)) {
                return pathStream
                        .filter(Files::isRegularFile)
                        .sorted(Comparator.comparing(path -> path.getFileName().toString().toLowerCase(Locale.ROOT)))
                        .map(path -> ProjectFileDto.builder()
                                .name(path.getFileName().toString())
                                .sizeBytes(readFileSize(path))
                                .build())
                        .toList();
            }
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to list project files");
        }
    }

    @Override
    public ProjectFileDto uploadProjectFile(Long projectId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Uploaded file is empty");
        }

        Project project = getOwnedProject(projectId);
        String safeFileName = normalizeFileName(file.getOriginalFilename());
        Path webRootPath = getProjectWebRootPath(project);
        Path targetPath = webRootPath.resolve(safeFileName).normalize();

        if (!targetPath.startsWith(webRootPath)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid file target path");
        }

        try {
            Files.createDirectories(webRootPath);
            ensureWorldReadableDirectory(webRootPath);
            file.transferTo(targetPath);
            ensureWorldReadableFile(targetPath);
            project.setUpdatedAt(LocalDateTime.now());
            projectRepository.save(project);
            return ProjectFileDto.builder()
                    .name(safeFileName)
                    .sizeBytes(Files.size(targetPath))
                    .build();
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to store uploaded file");
        }
    }

    @Override
    public void deleteProject(Long projectId) {
        Project project = getOwnedProject(projectId);
        projectRepository.delete(project);
    }

    private void provisionProject(Project project) throws IOException, InterruptedException {
        Path webRootPath = getProjectWebRootPath(project);
        Files.createDirectories(webRootPath);
        ensureWorldReadableDirectory(webRootPath);

        Path indexFile = webRootPath.resolve("index.html");
        if (!Files.exists(indexFile)) {
            Files.writeString(indexFile,
                    "<h1>" + project.getProjectName() + "</h1><p>Upload your own index.html via FTP or from the application.</p>",
                    StandardCharsets.UTF_8);
            ensureWorldReadableFile(indexFile);
        }

        writeOrUpdateVhostConfig(project);
        validateApacheConfig();
        reloadApacheGracefully();
    }

    private void writeOrUpdateVhostConfig(Project project) throws IOException {
        Path configDir = Paths.get(apacheVhostsDir).normalize();
        Files.createDirectories(configDir);
        String safeSlug = project.getSlug().replaceAll("[^a-z0-9-]", "-");
        String fileName = String.format(apacheVhostFilenamePattern, safeSlug);
        Path outputFile = configDir.resolve(fileName).normalize();

        String safeDocumentRoot = getProjectWebRootPath(project).toString();
        String content = "<VirtualHost *:80>\n"
                + "    ServerName " + project.getDomain() + "\n"
                + "    ServerAlias www." + project.getDomain() + "\n"
                + "    DocumentRoot \"" + safeDocumentRoot + "\"\n\n"
                + "    <Directory \"" + safeDocumentRoot + "\">\n"
                + "        Options Indexes FollowSymLinks\n"
                + "        AllowOverride All\n"
                + "        Require all granted\n"
                + "        DirectoryIndex index.html index.htm\n"
                + "    </Directory>\n\n"
                + "    ErrorLog /proc/self/fd/2\n"
                + "    CustomLog /proc/self/fd/1 combined\n"
                + "</VirtualHost>\n";

        Files.writeString(outputFile, content, StandardCharsets.UTF_8);
    }

    private void validateApacheConfig() throws IOException, InterruptedException {
        runCommand(apacheValidateCommand, "Apache config validation failed: ");
    }

    private void reloadApacheGracefully() throws IOException, InterruptedException {
        runCommand(apacheReloadCommand, "Apache graceful reload failed: ");
    }

    private void runCommand(String command, String errorPrefix) throws IOException, InterruptedException {
        if (command == null || command.isBlank()) {
            return;
        }
        Process process = new ProcessBuilder("sh", "-c", command)
                .redirectErrorStream(true)
                .start();

        String output = new String(process.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new IOException(errorPrefix + output.trim());
        }
    }

    private ProjectDTO mapToDto(Project project) {
        return ProjectDTO.builder()
                .id(project.getId())
                .userId(project.getUser().getId())
                .planId(project.getPlan() != null ? project.getPlan().getId() : null)
                .planCode(project.getPlan() != null ? project.getPlan().getCode() : null)
                .planName(project.getPlan() != null ? project.getPlan().getName() : null)
                .name(project.getProjectName())
                .slug(project.getSlug())
                .domain(project.getDomain())
                .status(project.getPublicationStatus())
                .webrootPath(project.getDocumentRoot())
                .ftpHost(project.getFtpHost())
                .ftpPort(project.getFtpPort())
                .ftpUsername(project.getFtpUsername())
                .ftpPassword(encryptedKeyService.decrypt(project.getFtpPasswordEncrypted()))
                .provisioningError(project.getProvisioningError())
                .createdAt(project.getCreatedAt() == null ? null : project.getCreatedAt().toString())
                .updatedAt(project.getUpdatedAt() == null ? null : project.getUpdatedAt().toString())
                .build();
    }

    private ProjectDTO mapToDtoWithoutSecrets(Project project) {
        ProjectDTO dto = mapToDto(project);
        dto.setFtpPassword(null);
        return dto;
    }

    private Subscription getActiveSubscription(Long userId) {
        return subscriptionRepo.findByUserId(userId).stream()
                .filter(s -> s.getStatus() == SubscriptionStatus.active)
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "You must select an active subscription plan before creating a project."));
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        return userRepo.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private Project getOwnedProject(Long projectId) {
        User user = getCurrentUser();
        return projectRepository.findByIdAndUserId(projectId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
    }

    private String normalizeAndValidateHost(String value) {
        String normalized = value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
        if (normalized.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Domain or hostname is required");
        }
        if (normalized.contains("/") || normalized.contains("\\") || normalized.contains("..")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Domain contains invalid characters");
        }
        if (!HOST_PATTERN.matcher(normalized).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Domain/hostname has invalid format");
        }
        return normalized;
    }


    private void ensureWorldReadableDirectory(Path directory) {
        setPosixPermissionsIfSupported(directory, EnumSet.of(
                PosixFilePermission.OWNER_READ, PosixFilePermission.OWNER_WRITE, PosixFilePermission.OWNER_EXECUTE,
                PosixFilePermission.GROUP_READ, PosixFilePermission.GROUP_EXECUTE,
                PosixFilePermission.OTHERS_READ, PosixFilePermission.OTHERS_EXECUTE));
    }

    private void ensureWorldReadableFile(Path file) {
        setPosixPermissionsIfSupported(file, EnumSet.of(
                PosixFilePermission.OWNER_READ, PosixFilePermission.OWNER_WRITE,
                PosixFilePermission.GROUP_READ,
                PosixFilePermission.OTHERS_READ));
    }

    private void setPosixPermissionsIfSupported(Path path, Set<PosixFilePermission> permissions) {
        try {
            Files.setPosixFilePermissions(path, permissions);
        } catch (UnsupportedOperationException ignored) {
            // Non-POSIX filesystem (e.g., Windows)
        } catch (IOException ignored) {
            // Keep provisioning/upload functional even if chmod fails
        }
    }

    private String normalizeFileName(String originalFilename) {
        String normalized = originalFilename == null ? "" : Paths.get(originalFilename).getFileName().toString();
        if (!SAFE_UPLOAD_FILENAME.matcher(normalized).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only letters, numbers, dot, underscore and dash are allowed in file name");
        }
        return normalized;
    }

    private void assertDomainIsAvailable(String domain) {
        if (projectRepository.existsByDomainIgnoreCase(domain)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Domain is already used by another project");
        }
    }

    private String normalizeProjectName(String name) {
        if (name == null || name.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Project name is required");
        }
        String trimmed = name.trim();
        if (trimmed.length() > 255) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Project name is too long");
        }
        return trimmed;
    }

    private String slugify(String value) {
        String base = value.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "");
        if (base.isBlank()) {
            base = "project";
        }
        return base + "-" + UUID.randomUUID().toString().substring(0, 8);
    }

    private String buildProjectWebRoot(Long userId, String slug) {
        return Paths.get(customersPath, "user_" + userId, slug, "www").normalize().toString();
    }

    private Path getProjectWebRootPath(Project project) {
        Path webRootPath = Paths.get(project.getDocumentRoot()).normalize();
        Path customersRoot = Paths.get(customersPath).normalize();
        if (!webRootPath.startsWith(customersRoot)) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Project webroot is outside configured customers path");
        }
        return webRootPath;
    }

    private String buildFtpUsername(Long userId, String slug) {
        String normalizedSlug = slug.replaceAll("[^a-z0-9]", "");
        if (normalizedSlug.length() > 10) {
            normalizedSlug = normalizedSlug.substring(0, 10);
        }
        return "u" + userId + "_" + normalizedSlug;
    }

    private String generateProvisionedSecret() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 16);
    }

    private long readFileSize(Path file) {
        try {
            return Files.size(file);
        } catch (IOException e) {
            return -1;
        }
    }
}
