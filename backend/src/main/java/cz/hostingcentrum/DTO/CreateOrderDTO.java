package cz.hostingcentrum.DTO;

import lombok.Data;

@Data
public class CreateOrderDTO {
    private String planCode;
    private String billingCycle;
}
