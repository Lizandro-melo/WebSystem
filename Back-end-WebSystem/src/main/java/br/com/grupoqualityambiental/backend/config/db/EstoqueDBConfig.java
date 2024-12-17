package br.com.grupoqualityambiental.backend.config.db;


import br.com.grupoqualityambiental.backend.repository.acesso.AcessoRepository;
import br.com.grupoqualityambiental.backend.repository.estoque.ItemEstoqueRepository;
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
        entityManagerFactoryRef = "estoqueEntityManagerFactory",
        transactionManagerRef = "estoqueTrancactionManager",
        basePackageClasses = ItemEstoqueRepository.class
)
public class EstoqueDBConfig {

    @Bean(name = "estoqueDataSource")
    @ConfigurationProperties(
            prefix = "estoque.datasource"
    )
    public HikariDataSource estoqueDataSource() {
        return DataSourceBuilder.create().type(HikariDataSource.class).build();
    }

    @Bean(name = "estoqueEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean estoqueEntityManagerFactory(EntityManagerFactoryBuilder builder, @Qualifier("estoqueDataSource") DataSource dataSource) {
        return builder.dataSource(dataSource).packages("br.com" +
                ".grupoqualityambiental.backend.models.estoque").persistenceUnit("estoquePU").build();
    }

    @Bean(name = "estoqueTrancactionManager")
    public PlatformTransactionManager estoqueTransactionManager(@Qualifier("estoqueEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}

