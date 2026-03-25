package cz.hostingcentrum.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDatabaseDTO {

    private Long id;        // ID databáze v DB
    private String dbName;  // název databáze
    private String dbUser;  // uživatel databáze
    private Long userId;    // ID vlastníka databáze
}