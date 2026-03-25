package cz.hostingcentrum.DTO;

import lombok.Data;

@Data
public class EmailAccountDTO {
    private Long id;
    private Long domainId;
    private String password;
    private String emailAddress;
    private Boolean isActive;
}