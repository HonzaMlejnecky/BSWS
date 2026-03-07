package cz.hostingcentrum.DTO;

import lombok.Data;

@Data
public class SftpAccountDto {
    private Long id;
    private Long userId;
    private String username;
    private String homeDirectory;
    private String password;
}
