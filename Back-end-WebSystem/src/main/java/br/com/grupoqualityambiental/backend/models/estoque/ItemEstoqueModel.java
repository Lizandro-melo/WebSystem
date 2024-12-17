package br.com.grupoqualityambiental.backend.models.estoque;

import br.com.grupoqualityambiental.backend.enumerated.colaborador.AuthColaboradorEnum;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Table(name = "item")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class ItemEstoqueModel{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private Boolean status;
    private Integer quantidade;
    @Column(name = "quantidade_minima")
    private Integer quantidadeMinima;
    @Column(name = "dir_foto")
    private String dirFoto;
    private String descricao;
    @ManyToOne
    @JoinColumn(name = "categoria")
    private CategoriaEstoqueModel categoria;
}
