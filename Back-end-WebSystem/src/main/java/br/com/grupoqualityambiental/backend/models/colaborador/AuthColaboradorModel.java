package br.com.grupoqualityambiental.backend.models.colaborador;

import br.com.grupoqualityambiental.backend.enumerated.colaborador.AuthColaboradorEnum;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Collection;
import java.util.List;

@Table(name = "auth")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class AuthColaboradorModel implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String login;
    private String password;
    private Boolean status;
    @Column(name = "contagem_login")
    private Integer contagemLogin;
    @Enumerated(EnumType.STRING)
    private AuthColaboradorEnum role;
    @Column(name = "alter_pass")
    private Boolean alterPass;
    private String otp;


    public AuthColaboradorModel(String login, String password, AuthColaboradorEnum role,
                                boolean alterPass) {
        this.login = login.toLowerCase();
        this.password = password;
        status = true;
        this.role = role;
        contagemLogin = 0;
        this.alterPass = alterPass;
    }

    public AuthColaboradorModel registerColaborador(String login) {
        this.login = login.toLowerCase();
        password = new BCryptPasswordEncoder().encode("12345678");
        status = true;
        role = AuthColaboradorEnum.USER;
        alterPass = true;
        return this;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.role == AuthColaboradorEnum.MASTER)
            return List.of(new SimpleGrantedAuthority("ROLE_MASTER"), new SimpleGrantedAuthority("ROLE_USER"));
        else if (this.role == AuthColaboradorEnum.PRESIDENCIA) {
            return List.of(new SimpleGrantedAuthority("ROLE_MASTER"), new SimpleGrantedAuthority("ROLE_USER"), new SimpleGrantedAuthority("ROLE_PRESIDENCIA"));
        } else return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getUsername() {
        return this.login;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
//        return contagemLogin != 2;
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.status;
    }
}
