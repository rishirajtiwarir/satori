package com.nihongo.backend.dto;

public class SenseiChatRequest {
    private String scenario;
    private String message;
    private String apiKey;

    public SenseiChatRequest() {}

    public SenseiChatRequest(String scenario, String message, String apiKey) {
        this.scenario = scenario;
        this.message = message;
        this.apiKey = apiKey;
    }

    public String getScenario() {
        return scenario;
    }

    public void setScenario(String scenario) {
        this.scenario = scenario;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }
}
