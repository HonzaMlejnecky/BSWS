package cz.hostingcentrum.Interface;

import cz.hostingcentrum.DTO.AuthDTO;
import cz.hostingcentrum.Model.User;

import java.util.Optional;

public interface UserService {
    Optional<User> findByEmail(String email);
    String verify(AuthDTO authDto);
    void register(AuthDTO auth);
    boolean verifyEmail(String email, String code);
}
