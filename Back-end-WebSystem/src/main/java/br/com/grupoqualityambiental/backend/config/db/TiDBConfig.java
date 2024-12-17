package br.com.grupoqualityambiental.backend.config.db;

import br.com.grupoqualityambiental.backend.repository.ti.SolicitacaoTiRepository;
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
        entityManagerFactoryRef = "tiEntityManagerFactory",
        transactionManagerRef = "tiTrancactionManager",
        basePackageClasses = SolicitacaoTiRepository.class
)
public class TiDBConfig {

    @Bean(name = "tiDataSource")
    @ConfigurationProperties(
            prefix = "ti.datasource"
    )
    public HikariDataSource tiDataSource() {
        return DataSourceBuilder.create().type(HikariDataSource.class).build();
    }

    @Bean(name = "tiEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean tiEntityManagerFactory(EntityManagerFactoryBuilder builder, @Qualifier("tiDataSource") DataSource dataSource) {
        return builder.dataSource(dataSource).packages("br.com" +
                ".grupoqualityambiental.backend.models.ti").persistenceUnit("tiPU").build();
    }

    @Bean(name = "tiTrancactionManager")
    public PlatformTransactionManager tiTransactionManager(@Qualifier("tiEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}

