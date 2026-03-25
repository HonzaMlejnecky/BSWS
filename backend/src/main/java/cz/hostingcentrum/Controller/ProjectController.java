package cz.hostingcentrum.Controller;

import cz.hostingcentrum.DTO.CreateProjectDTO;
import cz.hostingcentrum.DTO.ProjectDTO;
import cz.hostingcentrum.Interface.ProjectService;
import cz.hostingcentrum.generated.api.ProjectApi;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProjectController implements ProjectApi {

    private final ProjectService projectService;

    @Override
    public ResponseEntity<ProjectDTO> createProject(CreateProjectDTO createProjectDTO) {
        ProjectDTO project = projectService.createProject(createProjectDTO);
        return new ResponseEntity<>(project, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<List<ProjectDTO>> getUserProjects(Long userId) {
        return ResponseEntity.ok(projectService.getUserProjects(userId));
    }

    @Override
    public ResponseEntity<Void> deleteProject(Long projectId) {
        projectService.deleteProject(projectId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Override
    public ResponseEntity<ProjectDTO> publishProject(Long projectId) {
        return ResponseEntity.ok(projectService.publishProject(projectId));
    }

    @Override
    public ResponseEntity<ProjectDTO> redeployProject(Long projectId) {
        return ResponseEntity.ok(projectService.redeployProject(projectId));
    }
}
