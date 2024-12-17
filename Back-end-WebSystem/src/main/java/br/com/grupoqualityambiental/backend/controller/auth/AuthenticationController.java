package br.com.grupoqualityambiental.backend.controller.auth;

import br.com.grupoqualityambiental.backend.config.security.TokenService;
import br.com.grupoqualityambiental.backend.dto.auth.*;
import br.com.grupoqualityambiental.backend.dto.essential.ResponseMensagem;
import br.com.grupoqualityambiental.backend.exception.IntegridadeDadosException;
import br.com.grupoqualityambiental.backend.models.acesso.AcessoModel;
import br.com.grupoqualityambiental.backend.models.colaborador.AuthColaboradorModel;
import br.com.grupoqualityambiental.backend.models.colaborador.InfoColaboradorModel;
import br.com.grupoqualityambiental.backend.repository.acesso.AcessoRepository;
import br.com.grupoqualityambiental.backend.repository.colaborador.AuthColaboradorRepository;
import br.com.grupoqualityambiental.backend.repository.colaborador.InfoColaboradorRepository;
import br.com.grupoqualityambiental.backend.service.auth.AuthorizationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador de autenticação responsável por gerenciar operações relacionadas a login, cadastro,
 * validação de tokens e redefinição de senha.
 */
@RestController
@RequestMapping("auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AuthorizationService authorizationService;

    @Autowired
    private AuthColaboradorRepository authColaboradorRepository;

    @Autowired
    private InfoColaboradorRepository infoColaboradorRepository;

    @Autowired
    private AcessoRepository acessoRepository;

    @Autowired
    private TokenService tokenService;

    /**
     * Realiza o processo de login verificando as credenciais do usuário.
     *
     * @param authentication contém login e senha do usuário.
     * @return LoginResponse com token de acesso e informações adicionais do usuário.
     */
    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody @Valid Authentication authentication) {
        try {
            var login = authentication.login().toLowerCase();
            var usernamePassword = new UsernamePasswordAuthenticationToken(login, authentication.password());
            var auth = this.authenticationManager.authenticate(usernamePassword);
            var token = tokenService.generateToken((AuthColaboradorModel) auth.getPrincipal());
            AuthColaboradorModel userAuth = authColaboradorRepository.findByLoginAuth(login);
            InfoColaboradorModel user = infoColaboradorRepository.findById(userAuth.getId()).get();
            AcessoModel acessos = acessoRepository.findByReferentColaborador(userAuth.getId().longValue());
            return ResponseEntity.ok(new LoginResponse(token, "Acesso liberado!", user, acessos, userAuth.getAlterPass()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ResponseMensagem("Login ou senha incorretos. Por favor, verifique suas credenciais e tente novamente."));
        }
    }

    /**
     * Realiza o cadastro de um colaborador no sistema.
     *
     * @param register contém as informações necessárias para o cadastro.
     * @return ResponseEntity com mensagem de sucesso ou erro.
     */
    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody @Valid Register register) {
        try {
            return ResponseEntity.ok(authorizationService.register(register));
        } catch (IntegridadeDadosException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Revalida um usuário com base no token fornecido.
     *
     * @param token token de autenticação.
     * @return ResponseEntity contendo os dados do usuário ou status de erro.
     */
    @GetMapping(path = "/revalidate")
    public ResponseEntity<Object> revalidadeUser(@RequestParam(name = "token") String token) {
        if (tokenService.validateToken(token) == null) {
            return ResponseEntity.badRequest().build();
        }
        AuthColaboradorModel userAuth = authColaboradorRepository.findByLoginAuth(tokenService.validateToken(token));
        InfoColaboradorModel user = infoColaboradorRepository.findById(userAuth.getId()).get();
        AcessoModel acessos = acessoRepository.findByReferentColaborador(userAuth.getId().longValue());
        return ResponseEntity.ok(new RevalidateResponseDTO(user, acessos, userAuth.getAlterPass()));
    }

    /**
     * Permite ao colaborador alterar sua senha.
     *
     * @param senhas contém as informações de redefinição de senha.
     * @return ResponseEntity com mensagem de sucesso ou erro.
     */
    @PutMapping(path = "/alterpass")
    public ResponseEntity<String> alterPass(@RequestBody RedefinirSenhaDTO senhas) {
        AuthColaboradorModel userAuth = authColaboradorRepository.findById(senhas.idColaborador().longValue()).get();
        if (!senhas.novaSenha().equals(senhas.confirmSenha())) {
            return ResponseEntity.badRequest().body("Senhas diferentes!");
        }
        if (senhas.novaSenha().split("").length < 8) {
            return ResponseEntity.badRequest().body("A senha precisa ter pelo menos 8 caracteres!");
        }
        String encryptedPassword = new BCryptPasswordEncoder().encode(senhas.novaSenha());
        userAuth.setPassword(encryptedPassword);
        userAuth.setAlterPass(false);
        authColaboradorRepository.save(userAuth);
        return ResponseEntity.ok("Senha alterada com sucesso!");
    }

    /**
     * Envia um código OTP para redefinição de senha do colaborador.
     *
     * @param cpf CPF do colaborador.
     * @return ResponseEntity com mensagem de sucesso ou erro.
     */
    @GetMapping(path = "/sendotp")
    public ResponseEntity<String> sendOTPResetSenha(@RequestParam(name = "cpf") String cpf) throws IntegridadeDadosException {
        try {
            return ResponseEntity.ok(authorizationService.sendOTPResetSenhaService(cpf));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Remove o código OTP associado ao colaborador.
     *
     * @param cpf CPF do colaborador.
     * @return ResponseEntity com status de sucesso.
     */
    @GetMapping(path = "/deleteotp")
    public ResponseEntity<String> deleteOtp(@RequestParam(name = "cpf") String cpf) {
        authorizationService.deleteOTPResetSenhaService(cpf);
        return ResponseEntity.ok("");
    }

    /**
     * Encontra e valida um código OTP fornecido.
     *
     * @param otp código OTP.
     * @return ResponseEntity com a nova senha ou mensagem de erro.
     */
    @GetMapping(path = "/findotp")
    public ResponseEntity<String> findotp(@RequestParam(name = "otp") String otp) throws IntegridadeDadosException {
        try {
            return ResponseEntity.ok(authorizationService.findOtp(otp));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
