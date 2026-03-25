package cz.hostingcentrum.Controller;

import cz.hostingcentrum.DTO.SftpAccChangePassDTO;
import cz.hostingcentrum.DTO.SftpAccountDto;
import cz.hostingcentrum.Interface.SftpAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/sftp")
@RequiredArgsConstructor
public class SftpAccountController {

    private final SftpAccountService service;

    @PostMapping("/update-password")
    public ResponseEntity<String> updatePassword(@RequestBody SftpAccChangePassDTO dto) {
        service.updateSftpPassword(dto.getAccountId(), dto.getNewPassword());
        return ResponseEntity.ok("Password updated successfully");
    }

    @PostMapping("/create")
    public ResponseEntity<SftpAccountDto> create(@RequestBody SftpAccountDto dto) throws IOException, InterruptedException {
        return new ResponseEntity<>(service.createSftpAccount(dto), HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SftpAccountDto>> getByUser(@PathVariable Long userId) {
        return new ResponseEntity<>(service.getUserSftpAccounts(userId), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteSftpAccount(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}