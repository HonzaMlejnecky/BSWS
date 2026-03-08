package cz.hostingcentrum.Model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "disk_space_mb")
    private Integer diskSpaceMb;

    @Column(name = "max_projects")
    private Integer maxProjects;

    @Column(name = "max_databases")
    private Integer maxDatabases;

    @Column(name = "max_ftp_accounts")
    private Integer maxFtpAccounts;

    @Column(name = "max_email_accounts")
    private Integer maxEmailAccounts;

    @Column(name = "price_monthly")
    private Double priceMonthly;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "display_order")
    private Integer displayOrder;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}