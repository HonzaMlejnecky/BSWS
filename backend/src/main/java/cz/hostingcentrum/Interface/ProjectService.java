package cz.hostingcentrum.Interface;

import cz.hostingcentrum.DTO.CreateProjectDTO;
import cz.hostingcentrum.DTO.ProjectDTO;

import java.util.List;

public interface ProjectService {
    ProjectDTO createProject(CreateProjectDTO dto);
    List<ProjectDTO> getCurrentUserProjects();
    ProjectDTO getCurrentUserProject(Long projectId);
    void deleteProject(Long projectId);
}
