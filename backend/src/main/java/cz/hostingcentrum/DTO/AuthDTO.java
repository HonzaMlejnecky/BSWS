package cz.hostingcentrum.DTO;

import cz.hostingcentrum.Enum.Role;
import lombok.Data;

@Data
public class AuthDTO {
    private String email;
    private String password;
    private String role;
}

