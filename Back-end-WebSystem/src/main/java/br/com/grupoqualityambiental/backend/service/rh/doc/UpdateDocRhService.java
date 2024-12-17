package br.com.grupoqualityambiental.backend.service.rh.doc;

import br.com.grupoqualityambiental.backend.dto.rh.SubstituirDocRhDTO;
import br.com.grupoqualityambiental.backend.repository.rh.DocRhRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
public class UpdateDocRhService {
    @Autowired
    private DocRhRepository docRhRepository;

    public String updateDocPasta(MultipartFile file,
                                 String dir) {
        try {
            File theDir = new File(dir);
            if (!theDir.exists()) {
                theDir.mkdir();
            }
            String filePath = dir + "/" + file.getOriginalFilename();
            file.transferTo(new File(filePath));
            return file.getOriginalFilename();
        } catch (IOException e) {
            System.out.println(e.getMessage());
            return "";
        }
    }

    public String substituirDocExistente(SubstituirDocRhDTO docs) {
        docRhRepository.delete(docs.docExistente());
        docRhRepository.save(docs.docSubstituto());
        return "Documento substituido com sucesso!";
    }

    public String deleteDoc(Integer id) {
        docRhRepository.deleteById(id.longValue());
        return "Documento deletado com sucesso!";
    }
}
