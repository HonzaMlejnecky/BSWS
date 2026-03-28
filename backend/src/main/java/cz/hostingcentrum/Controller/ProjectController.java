package cz.hostingcentrum.Controller;

import cz.hostingcentrum.DTO.CreateProjectDTO;
import cz.hostingcentrum.DTO.ProjectDTO;
import cz.hostingcentrum.Interface.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping("/api/v1/projects")
    public ResponseEntity<ProjectDTO> createProject(@Valid @RequestBody CreateProjectDTO createProjectDTO) {
        ProjectDTO project = projectService.createProject(createProjectDTO);
        return new ResponseEntity<>(project, HttpStatus.CREATED);
    }

    @GetMapping("/api/v1/projects/me")
    public ResponseEntity<List<ProjectDTO>> getCurrentUserProjects() {
        return ResponseEntity.ok(projectService.getCurrentUserProjects());
    }

    @DeleteMapping("/api/v1/projects/{projectId}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long projectId) {
        projectService.deleteProject(projectId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/api/v1/projects/{projectId}/publish")
    public ResponseEntity<ProjectDTO> publishProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(projectService.publishProject(projectId));
    }

    @PostMapping("/api/v1/projects/{projectId}/redeploy")
    public ResponseEntity<ProjectDTO> redeployProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(projectService.redeployProject(projectId));
    }
}
