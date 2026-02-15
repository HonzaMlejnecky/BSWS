package cz.hostingcentrum.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "hosting_plans")
public class HostingPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "disk_space_mb", nullable = false)
    private Integer diskSpaceMb = 500;

    @Column(name = "bandwidth_mb", nullable = false)
    private Integer bandwidthMb = 10000;

    @Column(name = "max_domains")
    private Integer maxDomains = 1;

    @Column(name = "max_databases")
    private Integer maxDatabases = 1;

    @Column(name = "max_ftp_accounts")
    private Integer maxFtpAccounts = 1;

    @Column(name = "max_email_accounts")
    private Integer maxEmailAccounts = 5;

    @Column(name = "price_monthly", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceMonthly;

    @Column(name = "price_yearly", precision = 10, scale = 2)
    private BigDecimal priceYearly;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
