package cz.hostingcentrum.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

@Configuration
public class MailConfig {

    @Bean(name = "iredmailJdbc")
    public JdbcTemplate iredmailJdbcTemplate() {

        DriverManagerDataSource ds = new DriverManagerDataSource();
        ds.setUrl("jdbc:mariadb://iredmail:3306/vmail");
        ds.setUsername("root");
        ds.setPassword("password");

        return new JdbcTemplate(ds);
    }
}