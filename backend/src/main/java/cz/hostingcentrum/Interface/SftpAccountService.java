package cz.hostingcentrum.Interface;

import cz.hostingcentrum.DTO.SftpAccountDto;

import java.io.IOException;
import java.util.List;

public interface SftpAccountService {
    void deleteSftpAccount(Long id);
    SftpAccountDto createSftpAccount(SftpAccountDto dto) throws IOException, InterruptedException;
    List<SftpAccountDto> getUserSftpAccounts(Long userId);

}
