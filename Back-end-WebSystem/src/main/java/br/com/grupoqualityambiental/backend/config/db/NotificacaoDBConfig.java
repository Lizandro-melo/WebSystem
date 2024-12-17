package br.com.grupoqualityambiental.backend.config.db;


import br.com.grupoqualityambiental.backend.models.notificacao.InfoNotifyNotificacaoModels;
import br.com.grupoqualityambiental.backend.repository.notificacao.*;
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
        entityManagerFactoryRef = "notificacaoEntityManagerFactory",
        transactionManagerRef = "notificacaoTrancactionManager",
        basePackageClasses = InfoNotifyNotificacaoRepository.class
)
public class NotificacaoDBConfig {

    @Bean(name = "notificacaoDataSource")
    @ConfigurationProperties(
            prefix = "notificacao.datasource"
    )
    public HikariDataSource notificacaoDataSource() {
        return DataSourceBuilder.create().type(HikariDataSource.class).build();
    }

    @Bean(name = "notificacaoEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean notificacaoEntityManagerFactory(EntityManagerFactoryBuilder builder, @Qualifier("notificacaoDataSource") DataSource dataSource) {
        return builder.dataSource(dataSource).packages("br.com" +
                ".grupoqualityambiental.backend.models.notificacao").persistenceUnit("notificacaoPU").build();
    }

    @Bean(name = "notificacaoTrancactionManager")
    public PlatformTransactionManager notificacaoTransactionManager(@Qualifier("notificacaoEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}

