package cz.hostingcentrum.Service;

import cz.hostingcentrum.Interface.SftpgoApiService;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SftpgoApiServiceImpl implements SftpgoApiService {

    private final RestTemplate restTemplate = new RestTemplate();
    private String token;
    private final String baseUrl = "http://hc-sftpgo:8080";

    public String login() {
        String url = baseUrl + "/api/v2/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth("sftpgo", "sftpgo");  // Basic Auth like your working curl

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<Map> response =
                restTemplate.exchange(url, HttpMethod.GET, request, Map.class);

        this.token = (String) response.getBody().get("access_token");
        return token;
    }

    @Override
    public void updateUserPassword(String username, String newPassword) {
        if (token == null) {
            login();
        }

        // Nejprve načíst stávající uživatele
        String getUrl = baseUrl + "/api/v2/users/" + username;
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> getRequest = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(getUrl, HttpMethod.GET, getRequest, Map.class);
        Map<String, Object> user = response.getBody();

        // Změnit pouze heslo, zachovat permissions a další povinná pole
        user.put("password", newPassword);

        // PUT request pro update
        HttpEntity<Map<String, Object>> putRequest = new HttpEntity<>(user, headers);
        restTemplate.exchange(getUrl, HttpMethod.PUT, putRequest, String.class);
    }

    public void deleteUser(String username) {
        if (token == null) {
            login();
        }

        String url = baseUrl + "/api/v2/users/" + username;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        restTemplate.exchange(url, HttpMethod.DELETE, request, String.class);
    }

    public void createUser(String username, String password, String homeDir) {
        if (token == null) {
            login();
        }

        String url = baseUrl + "/api/v2/users";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("username", username);
        body.put("password", password);
        body.put("home_dir", homeDir);
        body.put("status", 1);
        body.put("permissions", Map.of("/", List.of("*")));

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        restTemplate.postForEntity(url, request, String.class);
    }
}