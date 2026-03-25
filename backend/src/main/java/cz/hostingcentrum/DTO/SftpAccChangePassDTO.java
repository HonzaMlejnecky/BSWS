package cz.hostingcentrum.DTO;

import lombok.Data;

@Data
public class SftpAccChangePassDTO {
    private Long accountId;
    private String newPassword;
}
