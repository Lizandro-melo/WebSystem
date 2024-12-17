package br.com.grupoqualityambiental.backend.service.auth;

import br.com.caelum.stella.validation.CPFValidator;
import br.com.grupoqualityambiental.backend.config.security.TokenService;
import br.com.grupoqualityambiental.backend.dto.auth.Authentication;
import br.com.grupoqualityambiental.backend.dto.auth.LoginResponse;
import br.com.grupoqualityambiental.backend.dto.auth.Register;
import br.com.grupoqualityambiental.backend.enumerated.colaborador.AuthColaboradorEnum;
import br.com.grupoqualityambiental.backend.enumerated.colaborador.TipoColaboradorEnum;
import br.com.grupoqualityambiental.backend.exception.IntegridadeDadosException;
import br.com.grupoqualityambiental.backend.models.acesso.AcessoModel;
import br.com.grupoqualityambiental.backend.models.colaborador.*;
import br.com.grupoqualityambiental.backend.models.rh.ConfigMatriculaRhModels;
import br.com.grupoqualityambiental.backend.repository.acesso.AcessoRepository;
import br.com.grupoqualityambiental.backend.repository.colaborador.*;
import br.com.grupoqualityambiental.backend.repository.rh.ConfigMatriculaRhRepository;
import br.com.grupoqualityambiental.backend.service.smtp.OTPmail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.Random;

/**
 * Serviço de autorização que lida com autenticação, registro de usuários e operações relacionadas.
 */
@Service
public class AuthorizationService implements UserDetailsService {

    @Autowired
    private AuthColaboradorRepository authColaboradorRepository;
    @Autowired
    private InfoColaboradorRepository infoColaboradorRepository;
    @Autowired
    private InfoCLTColaboradorRepository infoCLTColaboradorRepository;
    @Autowired
    private InfoEstagiarioColaboradorRepository infoEstagiarioColaboradorRepository;
    @Autowired
    private InfoMEIColaboradorRepository infoMEIColaboradorRepository;
    @Autowired
    private ContatoColaboradorRepository contatoColaboradorRepository;
    @Autowired
    private ConfigMatriculaRhRepository configMatriculaRhRepository;
    @Autowired
    private AcessoRepository acessoRepository;
    @Autowired
    private TokenService tokenService;

    /**
     * Busca detalhes do usuário pelo login (username).
     *
     * @param username o login do usuário.
     * @return Detalhes do usuário.
     * @throws UsernameNotFoundException se o usuário não for encontrado.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return authColaboradorRepository.findByLogin(username);
    }

    /**
     * Registra um novo colaborador com as informações fornecidas.
     *
     * @param register contém os dados do novo colaborador.
     * @return Mensagem de sucesso do cadastro.
     * @throws IntegridadeDadosException em caso de inconsistências nos dados.
     */
    public String register(Register register) throws IntegridadeDadosException {
        if (authColaboradorRepository.findByLogin(register.login().toLowerCase()) != null)
            throw new IntegridadeDadosException("O login gerado já está em uso. Por favor, gere outro.");
        AuthColaboradorModel newUser = new AuthColaboradorModel().registerColaborador(register.login());
        TipoColaboradorEnum tipoConvertido = TipoColaboradorEnum.valueOf(register.tipo());
        ConfigMatriculaRhModels configMatriculaRhModels = configMatriculaRhRepository.findAll().get(0);
        try {
            newUser = authColaboradorRepository.save(newUser);
        } catch (Exception e) {
            throw new IntegridadeDadosException("Ocorreu um erro inesperado. Por favor, tente novamente mais tarde. Se o problema persistir, entre em contato com o suporte.");
        }
        try {
            InfoColaboradorModel infoColaborador = new InfoColaboradorModel(register, newUser.getId());
            try {
                verificarCPF(infoColaborador.getCpf());
            } catch (Exception e) {
                throw new IntegridadeDadosException(e.getMessage());
            }
            switch (tipoConvertido) {
                case CLT:
                    infoColaborador.setIdentificacao("Func." + configMatriculaRhModels.getQuantidadeClt() + 1 + "." + register.empresa());
                    break;
                case ESTAGIARIO:
                    infoColaborador.setIdentificacao("Est." + configMatriculaRhModels.getQuantidadeEstagiario() + 1 + "." + register.empresa());
                    break;
                case TERCEIRIZADO:
                    infoColaborador.setIdentificacao("Terc." + configMatriculaRhModels.getQuantidadeMei() + 1);
                    break;
            }
            try {
                infoColaboradorRepository.save(infoColaborador);
            } catch (Exception e) {
                throw new IntegridadeDadosException("Ocorreu um erro inesperado. Por favor, tente novamente mais tarde. Se o problema persistir, entre em contato com o suporte.");
            }
            switch (tipoConvertido) {
                case CLT:
                    InfoCLTColaboradorModel infoCLT = new InfoCLTColaboradorModel(register, newUser.getId().intValue());
                    infoCLTColaboradorRepository.save(infoCLT);
                    configMatriculaRhModels.setQuantidadeClt(configMatriculaRhModels.getQuantidadeClt() + 1);
                    break;
                case ESTAGIARIO:
                    InfoEstagiarioColaboradorModel infoEstagiario = new InfoEstagiarioColaboradorModel(register, newUser.getId().intValue());
                    infoEstagiarioColaboradorRepository.save(infoEstagiario);
                    configMatriculaRhModels.setQuantidadeEstagiario(configMatriculaRhModels.getQuantidadeEstagiario() + 1);
                    break;
                case TERCEIRIZADO:
                    InfoMEIColaboradorModel infoMEI = new InfoMEIColaboradorModel(register, newUser.getId().intValue());
                    infoMEIColaboradorRepository.save(infoMEI);
                    configMatriculaRhModels.setQuantidadeMei(configMatriculaRhModels.getQuantidadeMei() + 1);
                    break;
            }
            ContatoColaboradorModel contatoColaborador = new ContatoColaboradorModel(register, infoColaborador);
            try {
                contatoColaboradorRepository.save(contatoColaborador);
                configMatriculaRhRepository.save(configMatriculaRhModels);
            } catch (Exception e) {
                throw new IntegridadeDadosException("Ocorreu um erro inesperado. Por favor, tente novamente mais tarde. Se o problema persistir, entre em contato com o suporte.");
            }

        } catch (Exception e) {
            authColaboradorRepository.deleteById(newUser.getId());
            throw new IntegridadeDadosException("Ocorreu um erro inesperado. Por favor, tente novamente mais tarde. Se o problema persistir, entre em contato com o suporte.");
        }
        return "Cadastro realizado com sucesso! Bem-vindo(a)!";
    }

    /**
     * Verifica a validade do CPF informado.
     *
     * @param cpf o CPF a ser validado.
     * @return true se o CPF for válido.
     * @throws IntegridadeDadosException se o CPF for inválido ou já existente.
     */
    public boolean verificarCPF(String cpf) throws IntegridadeDadosException {
        CPFValidator cpfValidator = new CPFValidator();
        try {
            cpfValidator.assertValid(cpf);
        } catch (Exception e) {
            throw new IntegridadeDadosException("CPF invalido");
        }
        if (infoColaboradorRepository.findByCpf(cpf) != null) {
            throw new IntegridadeDadosException("Este CPF já existe em nosso sistema.");
        }
        return true;
    }

    /**
     * Envia um código OTP para o e-mail corporativo do usuário, com base no CPF informado.
     *
     * @param cpf CPF do colaborador.
     * @return Mensagem de sucesso no envio do e-mail.
     * @throws IntegridadeDadosException se o CPF não for encontrado ou o e-mail corporativo estiver ausente.
     */
    public String sendOTPResetSenhaService(String cpf) throws IntegridadeDadosException {
        try {
            InfoColaboradorModel info = infoColaboradorRepository.findByCpf(cpf);
            String otp = new DecimalFormat("000000").format(new Random().nextInt(999999));
            OTPmail otpmail = new OTPmail();
            AuthColaboradorModel auth = authColaboradorRepository.findById(info.getFkAuth()).get();
            if (info.getEmailCorporativo() == null) {
                throw new IntegridadeDadosException("Email corporativo ausente!");
            }
            auth.setOtp(otp);
            authColaboradorRepository.save(auth);
            otpmail.sendEmail(otp, info.getEmailCorporativo());
            return "Email enviado com sucesso!";
        } catch (Exception e) {
            throw new IntegridadeDadosException("CPF não encontrado em nosso banco de dados");
        }
    }

    /**
     * Remove o código OTP associado ao usuário, com base no CPF fornecido.
     *
     * @param cpf CPF do colaborador.
     */
    public void deleteOTPResetSenhaService(String cpf) {
        InfoColaboradorModel info = infoColaboradorRepository.findByCpf(cpf);
        AuthColaboradorModel auth = authColaboradorRepository.findById(info.getFkAuth()).get();
        auth.setOtp(null);
        authColaboradorRepository.save(auth);
    }

    /**
     * Verifica o código OTP fornecido, define uma nova senha e marca o colaborador para alteração obrigatória de senha.
     *
     * @param otp Código OTP fornecido pelo usuário.
     * @return A nova senha gerada.
     * @throws IntegridadeDadosException se o OTP for inválido.
     */
    public String findOtp(String otp) throws IntegridadeDadosException {
        AuthColaboradorModel auth = authColaboradorRepository.findByOtp(otp);
        if (auth == null) {
            throw new IntegridadeDadosException("Código incorreto!");
        }
        String newPass = new DecimalFormat("0000000").format(new Random().nextInt(9999997));
        String encryptedPassword = new BCryptPasswordEncoder().encode(newPass);
        auth.setPassword(encryptedPassword);
        auth.setAlterPass(true);
        auth.setOtp(null);
        authColaboradorRepository.save(auth);
        return newPass;
    }
}
