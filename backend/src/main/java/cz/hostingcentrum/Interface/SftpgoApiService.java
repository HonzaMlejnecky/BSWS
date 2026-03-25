package cz.hostingcentrum.Interface;

public interface SftpgoApiService {
    String login();
    void createUser(String username, String password, String homeDir);
    void deleteUser(String username);
    void updateUserPassword(String username, String newPassword);
}
