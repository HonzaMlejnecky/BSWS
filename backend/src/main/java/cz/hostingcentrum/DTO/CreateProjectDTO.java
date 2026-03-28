package cz.hostingcentrum.DTO;

import lombok.Data;

@Data
public class CreateProjectDTO {
    private String domain;
    private String documentRoot;
    private String runtime;
}
