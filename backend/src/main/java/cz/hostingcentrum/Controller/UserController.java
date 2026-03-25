package cz.hostingcentrum.Controller;

import cz.hostingcentrum.DTO.CurrentUserDto;
import cz.hostingcentrum.Model.User;
import cz.hostingcentrum.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserRepo userRepo;

    @GetMapping("/api/v1/users/me")
    public CurrentUserDto getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        User user = userRepo.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        return new CurrentUserDto(user.getId(), user.getEmail(), user.getRole());
    }
}
