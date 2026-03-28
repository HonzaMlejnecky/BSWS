package cz.hostingcentrum.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateProjectDTO {

    @NotBlank(message = "Project name is required")
    private String name;

    @NotBlank(message = "Domain or hostname is required")
    private String domain;
}
