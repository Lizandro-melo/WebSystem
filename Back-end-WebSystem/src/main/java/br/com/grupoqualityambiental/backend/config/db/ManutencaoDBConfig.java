package br.com.grupoqualityambiental.backend.config.db;

import br.com.grupoqualityambiental.backend.repository.manutencao.SolicitacaoManutencaoRepository;
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
        entityManagerFactoryRef = "manutencaoEntityManagerFactory",
        transactionManagerRef = "manutencaoTrancactionManager",
        basePackageClasses = SolicitacaoManutencaoRepository.class
)
public class ManutencaoDBConfig {

    @Bean(name = "manutencaoDataSource")
    @ConfigurationProperties(
            prefix = "manutencao.datasource"
    )
    public HikariDataSource manutencaoDataSource() {
        return DataSourceBuilder.create().type(HikariDataSource.class).build();
    }

    @Bean(name = "manutencaoEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean manutencaoEntityManagerFactory(EntityManagerFactoryBuilder builder, @Qualifier("manutencaoDataSource") DataSource dataSource) {
        return builder.dataSource(dataSource).packages("br.com" +
                ".grupoqualityambiental.backend.models.manutencao").persistenceUnit("manutencaoPU").build();
    }

    @Bean(name = "manutencaoTrancactionManager")
    public PlatformTransactionManager manutencaoTransactionManager(@Qualifier("manutencaoEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}

