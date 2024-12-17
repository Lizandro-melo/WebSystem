package br.com.grupoqualityambiental.backend.repository.colaborador;

import br.com.grupoqualityambiental.backend.models.colaborador.AuthColaboradorModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public interface AuthColaboradorRepository extends JpaRepository<AuthColaboradorModel,
        Long> {
    UserDetails findByLogin(String login);


    @Query(value = "SELECT * from auth WHERE login" +
            " = :login", nativeQuery = true)
    AuthColaboradorModel findByLoginAuth(@Param(value = "login") String login);

    List<AuthColaboradorModel> findByStatus(boolean b);

    AuthColaboradorModel findByOtp(String otp);
}
