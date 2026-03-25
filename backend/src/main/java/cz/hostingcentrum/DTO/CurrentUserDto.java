package cz.hostingcentrum.DTO;

import cz.hostingcentrum.Enum.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CurrentUserDto {
    private Long id;
    private String email;
    private Role role;
}
