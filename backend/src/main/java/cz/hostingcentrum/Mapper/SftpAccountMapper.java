package cz.hostingcentrum.Mapper;

import cz.hostingcentrum.DTO.SftpAccountDto;
import cz.hostingcentrum.Model.SftpAccount;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SftpAccountMapper {

    @Mapping(target = "username", source = "sftpUsername")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "password", ignore = true)
    SftpAccountDto toDto(SftpAccount account);

    @Mapping(target = "sftpUsername", source = "username")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "lastLoginAt", ignore = true)
    @Mapping(target = "user", ignore = true)
    SftpAccount toEntity(SftpAccountDto dto);
}
