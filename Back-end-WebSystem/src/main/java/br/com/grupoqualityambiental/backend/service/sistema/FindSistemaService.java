package br.com.grupoqualityambiental.backend.service.sistema;

import br.com.grupoqualityambiental.backend.dto.system.NiverDoMesDTO;
import br.com.grupoqualityambiental.backend.models.colaborador.AuthColaboradorModel;
import br.com.grupoqualityambiental.backend.models.colaborador.InfoColaboradorModel;
import br.com.grupoqualityambiental.backend.repository.colaborador.AuthColaboradorRepository;
import br.com.grupoqualityambiental.backend.repository.colaborador.InfoColaboradorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class FindSistemaService {

    @Autowired
    private InfoColaboradorRepository infoColaboradorRepository;
    @Autowired
    private AuthColaboradorRepository authColaboradorRepository;

    public List<NiverDoMesDTO> findNiverDoMes() {
        List<NiverDoMesDTO> niverDoMes = new ArrayList<>();
        for (AuthColaboradorModel auth : authColaboradorRepository.findByStatus(true)) {
            try {
                InfoColaboradorModel info = infoColaboradorRepository.findById(auth.getId()).get();
                if (LocalDate.now().getMonth() == info.getDataNascimento().getMonth()) {
                    niverDoMes.add(new NiverDoMesDTO(info.getNomeCompleto(), info.getDataNascimento(), info.getDirFoto()));
                }
            }catch (Exception e){
                continue;
            }
        }
        return niverDoMes;
    }

}
