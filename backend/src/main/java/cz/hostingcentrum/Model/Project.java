package cz.hostingcentrum.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "project_name", nullable = false)
    private String projectName;

    @Column(name = "domain", nullable = false, unique = true)
    private String domain;

    @Column(name = "document_root", nullable = false)
    private String documentRoot;

    @Column(name = "runtime", nullable = false)
    private String runtime;

    @Column(name = "publication_status", nullable = false)
    private String publicationStatus;

    @Column(name = "provisioning_error")
    private String provisioningError;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
