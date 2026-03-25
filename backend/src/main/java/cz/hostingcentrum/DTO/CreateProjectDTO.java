package cz.hostingcentrum.DTO;

import lombok.Data;

@Data
public class CreateProjectDTO {
    private Long userId;
    private String domain;
    private String documentRoot;
    private String runtime;
}
