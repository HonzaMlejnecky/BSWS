package cz.hostingcentrum.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterDto {
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must have at least 8 characters")
    private String password;

    private String firstName;
    private String lastName;
    private String street;
    private String city;
    private String postalCode;
    private String country;
    private String phone;
}
