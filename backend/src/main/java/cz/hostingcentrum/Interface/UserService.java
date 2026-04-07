package cz.hostingcentrum.Interface;

import cz.hostingcentrum.DTO.LoginDto;
import cz.hostingcentrum.DTO.RegisterDto;
import cz.hostingcentrum.Model.User;

public interface UserService {
    User findByEmail(String email);
    String verify(LoginDto authDto);
    void register(RegisterDto auth);
}
