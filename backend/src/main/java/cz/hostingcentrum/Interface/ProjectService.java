package cz.hostingcentrum.Interface;

import cz.hostingcentrum.DTO.CreateProjectDTO;
import cz.hostingcentrum.DTO.ProjectDTO;

import java.util.List;

public interface ProjectService {
    ProjectDTO createProject(CreateProjectDTO dto);
    List<ProjectDTO> getUserProjects(Long userId);
    void deleteProject(Long projectId);
    ProjectDTO publishProject(Long projectId);
    ProjectDTO redeployProject(Long projectId);
}
