package cz.hostingcentrum.Mapper;

import cz.hostingcentrum.DTO.CreateEmailDomainDTO;
import cz.hostingcentrum.DTO.EmailAccountDTO;
import cz.hostingcentrum.DTO.EmailDomainDTO;
import cz.hostingcentrum.Model.EmailAccount;
import cz.hostingcentrum.Model.EmailDomain;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EmailMapper {

    @Mapping(target = "domainId", source = "emailDomain.id")
    @Mapping(target = "password", ignore = true)
    EmailAccountDTO toAccountDto(EmailAccount account);

    @Mapping(target = "emailDomain", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "lastLoginAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    EmailAccount toAccountEntity(EmailAccountDTO dto);

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "accounts", ignore = true)
    EmailDomainDTO toDomainDto(EmailDomain domain);

    @Mapping(target = "userId", source = "user.id")
    CreateEmailDomainDTO toCreateDomainDto(EmailDomain domain);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    EmailDomain toDomainEntity(CreateEmailDomainDTO dto);
}
