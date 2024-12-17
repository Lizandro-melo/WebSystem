package br.com.grupoqualityambiental.backend.config.db;

import br.com.grupoqualityambiental.backend.repository.colaborador.AuthColaboradorRepository;
import com.zaxxer.hikari.HikariDataSource;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        basePackageClasses = AuthColaboradorRepository.class,
        transactionManagerRef = "colaboradorTransactionManager",
        entityManagerFactoryRef = "colaboradorEntityManagerFactory"
)
public class ColaboradorDBConfig {

    @Primary
    @Bean(name = "colaboradorDataSource")
    @ConfigurationProperties(
            prefix = "colaborador.datasource"
    )
    public HikariDataSource colaboradorDataSource() {
        return DataSourceBuilder.create().type(HikariDataSource.class).build();
    }

    @Primary
    @Bean(name = "colaboradorEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean colaboradorEntityManagerFactory(EntityManagerFactoryBuilder builder, @Qualifier("colaboradorDataSource") DataSource dataSource){
        return builder.dataSource(dataSource).packages("br.com.grupoqualityambiental.backend.models.colaborador").persistenceUnit("colaboradorPU").build();
    }

    @Primary
    @Bean(name = "colaboradorTransactionManager")
    public PlatformTransactionManager colaboradorTransactionManager(@Qualifier("colaboradorEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }

}
