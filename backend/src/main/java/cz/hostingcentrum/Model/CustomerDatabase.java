package cz.hostingcentrum.Model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_databases")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDatabase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "db_name", nullable = false, unique = true)
    private String dbName;

    @Column(name = "db_user", nullable = false, unique = true)
    private String dbUser;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}