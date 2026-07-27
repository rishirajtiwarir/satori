package com.nihongo.backend.controller;

import com.nihongo.backend.dto.SenseiChatRequest;
import com.nihongo.backend.dto.SenseiChatResponse;
import com.nihongo.backend.service.AiSenseiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/sensei")
@CrossOrigin(origins = "*")
public class AiSenseiController {

    private final AiSenseiService aiSenseiService;

    public AiSenseiController(AiSenseiService aiSenseiService) {
        this.aiSenseiService = aiSenseiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<SenseiChatResponse> chatWithSensei(@RequestBody SenseiChatRequest request) {
        SenseiChatResponse response = aiSenseiService.processChat(request);
        return ResponseEntity.ok(response);
    }
}
