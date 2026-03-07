package cz.hostingcentrum.Model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sftp_accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SftpAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "sftp_username", nullable = false, unique = true)
    private String sftpUsername;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "home_directory")
    private String homeDirectory;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}