package cz.hostingcentrum.DTO;

import lombok.Data;

import java.util.List;

@Data
public class EmailDomainDTO {
    private Long id;
    private String domainName;
    private Long userId;
    private Boolean isActive;

    private List<EmailAccountDTO> accounts;
}