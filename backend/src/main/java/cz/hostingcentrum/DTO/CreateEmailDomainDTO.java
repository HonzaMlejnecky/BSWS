package cz.hostingcentrum.DTO;

import lombok.Data;

@Data
public class CreateEmailDomainDTO {
    private Long id;
    private String domainName;
    private Long userId;
    private Boolean isActive;
}
