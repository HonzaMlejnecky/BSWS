package cz.hostingcentrum.Controller;

import cz.hostingcentrum.DTO.SftpAccChangePassDTO;
import cz.hostingcentrum.DTO.SftpAccountDto;
import cz.hostingcentrum.Interface.SftpAccountService;
import cz.hostingcentrum.generated.api.SftpApi;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class SftpAccountController implements SftpApi {

    private final SftpAccountService service;

    @Override
    public ResponseEntity<String> updateSftpPassword(SftpAccChangePassDTO dto) {
        service.updateSftpPassword(dto.getAccountId(), dto.getNewPassword());
        return ResponseEntity.ok("Password updated successfully");
    }

    @Override
    public ResponseEntity<SftpAccountDto> createSftpAccount(SftpAccountDto dto) throws IOException, InterruptedException {
        return new ResponseEntity<>(service.createSftpAccount(dto), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<List<SftpAccountDto>> getSftpAccountsByUser(Long userId) {
        return new ResponseEntity<>(service.getUserSftpAccounts(userId), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Void> deleteSftpAccount(Long id) {
        service.deleteSftpAccount(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
