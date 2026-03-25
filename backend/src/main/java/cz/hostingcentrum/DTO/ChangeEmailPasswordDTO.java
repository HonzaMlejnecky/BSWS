package cz.hostingcentrum.DTO;

import lombok.Data;

@Data
public class ChangeEmailPasswordDTO {
    private Long accountId;
    private String newPassword;
}