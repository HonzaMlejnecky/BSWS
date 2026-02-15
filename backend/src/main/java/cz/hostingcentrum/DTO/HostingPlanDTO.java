package cz.hostingcentrum.DTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class HostingPlanDTO {
    private Long id;
    private String code;
    private String name;
    private String description;
    private Integer diskSpaceMb;
    private Integer bandwidthMb;
    private Integer maxDomains;
    private Integer maxDatabases;
    private Integer maxFtpAccounts;
    private Integer maxEmailAccounts;
    private BigDecimal priceMonthly;
    private BigDecimal priceYearly;
}
