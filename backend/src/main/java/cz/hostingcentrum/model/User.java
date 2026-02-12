package cz.hostingcentrum.model;

import cz.hostingcentrum.Enum.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "\"user\"")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String code;

    private LocalDate dateRegister;

    @Enumerated(EnumType.STRING)
    private Role role;
}
