package cz.hostingcentrum.DTO;

import lombok.Data;

@Data
public class ChangePassDbDTO {
    private Long databaseId;
    private String newPassword;
}