package cz.hostingcentrum.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDTO {
    private Long id;
    private Long userId;
    private Long planId;
    private String planCode;
    private String planName;
    private String name;
    private String slug;
    private String domain;
    private String status;
    private String webrootPath;
    private String ftpHost;
    private Integer ftpPort;
    private String ftpUsername;
    private String ftpPassword;
    private String provisioningError;
    private String createdAt;
    private String updatedAt;
}
