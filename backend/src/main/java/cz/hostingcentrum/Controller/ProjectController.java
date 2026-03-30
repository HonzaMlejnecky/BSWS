package cz.hostingcentrum.Controller;

import cz.hostingcentrum.DTO.CreateProjectDTO;
import cz.hostingcentrum.DTO.ProjectDTO;
import cz.hostingcentrum.DTO.ProjectFileDto;
import cz.hostingcentrum.Interface.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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

    @GetMapping("/api/v1/projects/{projectId}")
    public ResponseEntity<ProjectDTO> getProjectDetail(@PathVariable Long projectId) {
        return ResponseEntity.ok(projectService.getCurrentUserProject(projectId));
    }

    @GetMapping("/api/v1/projects/{projectId}/files")
    public ResponseEntity<List<ProjectFileDto>> listProjectFiles(@PathVariable Long projectId) {
        return ResponseEntity.ok(projectService.listProjectFiles(projectId));
    }

    @PostMapping(value = "/api/v1/projects/{projectId}/files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProjectFileDto> uploadProjectFile(
            @PathVariable Long projectId,
            @RequestParam("file") MultipartFile file
    ) {
        return new ResponseEntity<>(projectService.uploadProjectFile(projectId, file), HttpStatus.CREATED);
    }

    @DeleteMapping("/api/v1/projects/{projectId}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long projectId) {
        projectService.deleteProject(projectId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
