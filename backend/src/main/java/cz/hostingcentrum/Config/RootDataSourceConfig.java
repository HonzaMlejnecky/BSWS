package cz.hostingcentrum.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import org.springframework.jdbc.datasource.DriverManagerDataSource;

@Configuration
public class RootDataSourceConfig {

    @Value("${root.datasource.url}")
    private String url;

    @Value("${root.datasource.username}")
    private String username;

    @Value("${root.datasource.password}")
    private String password;

    @Value("${root.datasource.driver-class-name}")
    private String driverClassName;

    @Bean(name = "rootJdbcTemplate")
    public JdbcTemplate rootJdbcTemplate() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        dataSource.setDriverClassName(driverClassName);

        return new JdbcTemplate(dataSource);
    }
}