package cz.hostingcentrum.DTO;

import lombok.Data;

@Data
public class CreateDbDTO {
    private Long userId;
    private String dbName;
    private String username;
    private String password;
}
