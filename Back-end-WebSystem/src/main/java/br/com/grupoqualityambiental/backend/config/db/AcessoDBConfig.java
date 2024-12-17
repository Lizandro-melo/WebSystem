package br.com.grupoqualityambiental.backend.config.db;


import br.com.grupoqualityambiental.backend.repository.acesso.AcessoRepository;
import com.zaxxer.hikari.HikariDataSource;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        entityManagerFactoryRef = "acessoEntityManagerFactory",
        transactionManagerRef = "acessoTrancactionManager",
        basePackageClasses = AcessoRepository.class
)
public class AcessoDBConfig {

    @Bean(name = "acessoDataSource")
    @ConfigurationProperties(
            prefix = "acesso.datasource"
    )
    public HikariDataSource acessoDataSource() {
        return DataSourceBuilder.create().type(HikariDataSource.class).build();
    }

    @Bean(name = "acessoEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean acessoEntityManagerFactory(EntityManagerFactoryBuilder builder, @Qualifier("acessoDataSource") DataSource dataSource) {
        return builder.dataSource(dataSource).packages("br.com" +
                ".grupoqualityambiental.backend.models.acesso").persistenceUnit("acessoPU").build();
    }

    @Bean(name = "acessoTrancactionManager")
    public PlatformTransactionManager acessoTransactionManager(@Qualifier("acessoEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}

