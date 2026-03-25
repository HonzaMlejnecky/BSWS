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
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepo userRepo;
    private final SubscriptionRepo subscriptionRepo;

    @Override
    public ProjectDTO createProject(CreateProjectDTO dto) {
        User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

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

        String runtime = normalizeRuntime(dto.getRuntime());

        Project saved = projectRepository.save(Project.builder()
                .user(user)
                .projectName(dto.getDomain())
                .domain(dto.getDomain())
                .documentRoot(dto.getDocumentRoot())
                .runtime(runtime)
                .publicationStatus("draft")
                .isActive(Boolean.TRUE)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        return mapToDto(saved);
    }

    @Override
    public List<ProjectDTO> getUserProjects(Long userId) {
        return projectRepository.findByUserId(userId)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public void deleteProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        projectRepository.delete(project);
    }

    @Override
    public ProjectDTO publishProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setPublicationStatus("published");
        project.setUpdatedAt(LocalDateTime.now());
        project.setIsActive(Boolean.TRUE);

        return mapToDto(projectRepository.save(project));
    }

    @Override
    public ProjectDTO redeployProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

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
}
