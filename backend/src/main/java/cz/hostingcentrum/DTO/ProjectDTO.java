package cz.hostingcentrum.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDTO {
    private Long id;
    private Long userId;
    private String domain;
    private String documentRoot;
    private String runtime;
    private String publicationStatus;
}
