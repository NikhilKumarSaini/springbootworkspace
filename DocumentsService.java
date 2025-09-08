package com.loanorigination.service;

import com.loanorigination.entity.Documents;
import com.loanorigination.repository.DocumentsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
public class DocumentsService {

    @Autowired
    private DocumentsRepository documentsRepository;

    public Documents saveDocument(String customerId, String docType, MultipartFile file) throws IOException {
        Documents doc = new Documents();
        doc.setCustomerId(customerId);
        doc.setDocType(docType);
        doc.setFileName(file.getOriginalFilename());
        doc.setFileType(file.getContentType());
        doc.setData(file.getBytes());

        return documentsRepository.save(doc);
    }

    public Optional<Documents> getDocument(Long id) {
        return documentsRepository.findById(id);
    }
}
