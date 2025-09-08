package com.loanorigination.controller;

import com.loanorigination.entity.Documents;
import com.loanorigination.service.DocumentsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/documents")
public class DocumentsController {

    @Autowired
    private DocumentsService documentsService;

    // Upload API
    @PostMapping("/upload")
    public ResponseEntity<String> uploadDocument(
            @RequestParam("customerId") String customerId,
            @RequestParam("docType") String docType,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        documentsService.saveDocument(customerId, docType, file);
        return ResponseEntity.ok("File uploaded successfully");
    }

    // Download API
    @GetMapping("/{id}")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable Long id) {
        return documentsService.getDocument(id)
                .map(doc -> ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(doc.getFileType()))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getFileName() + "\"")
                        .body(doc.getData()))
                .orElse(ResponseEntity.notFound().build());
    }
}
