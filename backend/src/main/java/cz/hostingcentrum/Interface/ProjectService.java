package cz.hostingcentrum.Interface;

import cz.hostingcentrum.DTO.CreateProjectDTO;
import cz.hostingcentrum.DTO.ProjectDTO;
import cz.hostingcentrum.DTO.ProjectFileDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProjectService {
    ProjectDTO createProject(CreateProjectDTO dto);
    List<ProjectDTO> getCurrentUserProjects();
    ProjectDTO getCurrentUserProject(Long projectId);
    List<ProjectFileDto> listProjectFiles(Long projectId);
    ProjectFileDto uploadProjectFile(Long projectId, MultipartFile file);
    void deleteProject(Long projectId);
}
