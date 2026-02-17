package cz.hostingcentrum.Config;

import cz.hostingcentrum.Model.User;
import cz.hostingcentrum.Model.UserDetailsCustom;
import cz.hostingcentrum.Repository.UserRepo;
import lombok.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailsServiceCustom implements UserDetailsService {

    private static final Logger log = LoggerFactory.getLogger(UserDetailsServiceCustom.class);

    @Autowired
    private UserRepo userRepo;


    @Override
    @NonNull
    public UserDetails loadUserByUsername(@NonNull String email) throws UsernameNotFoundException {
        Optional<User> user = userRepo.findByEmail(email);
        if (user.isEmpty()) {
            log.warn("User not found for email: {}", email);
            throw new UsernameNotFoundException("user not found");
        }

        return new UserDetailsCustom(user.get());
    }
}
