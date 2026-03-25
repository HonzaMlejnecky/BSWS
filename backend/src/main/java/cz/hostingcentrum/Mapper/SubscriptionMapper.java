package cz.hostingcentrum.Mapper;

import cz.hostingcentrum.DTO.SubscriptionDto;
import cz.hostingcentrum.Model.Subscription;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SubscriptionMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "planId", source = "plan.id")
    SubscriptionDto toDto(Subscription subscription);
}
