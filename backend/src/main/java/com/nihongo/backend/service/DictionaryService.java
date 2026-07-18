package com.nihongo.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

@Service
public class DictionaryService {
    
    private final RestTemplate restTemplate;
    private final String JISHO_API_URL = "https://jisho.org/api/v1/search/words?keyword=";

    public DictionaryService() {
        this.restTemplate = new RestTemplate();
    }

    public Object searchWord(String keyword) {
        String url = JISHO_API_URL + keyword;
        ResponseEntity<Object> response = restTemplate.getForEntity(url, Object.class);
        return response.getBody();
    }
}
