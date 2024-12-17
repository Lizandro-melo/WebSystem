package br.com.grupoqualityambiental.backend.config.db;

import br.com.grupoqualityambiental.backend.repository.rh.DocRhRepository;
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
        entityManagerFactoryRef = "rhEntityManagerFactory",
        transactionManagerRef = "rhTrancactionManager",
        basePackageClasses = DocRhRepository.class
)
public class RhDBConfig {

    @Bean(name = "rhDataSource")
    @ConfigurationProperties(
            prefix = "rh.datasource"
    )
    public HikariDataSource rhDataSource() {
        return DataSourceBuilder.create().type(HikariDataSource.class).build();
    }

    @Bean(name = "rhEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean rhEntityManagerFactory(EntityManagerFactoryBuilder builder, @Qualifier("rhDataSource") DataSource dataSource) {
        return builder.dataSource(dataSource).packages("br.com" +
                ".grupoqualityambiental.backend.models.rh").persistenceUnit("rhPU").build();
    }

    @Bean(name = "rhTrancactionManager")
    public PlatformTransactionManager rhTransactionManager(@Qualifier("rhEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}

