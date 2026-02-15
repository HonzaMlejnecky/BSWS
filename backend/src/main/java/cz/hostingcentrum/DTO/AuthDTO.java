package cz.hostingcentrum.DTO;

import lombok.Data;

@Data
public class AuthDTO {
    private String email;
    private String password;
    private String role;
}

