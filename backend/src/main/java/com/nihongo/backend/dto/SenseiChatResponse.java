package com.nihongo.backend.dto;

public class SenseiChatResponse {
    private String replyJapanese;
    private String replyRomaji;
    private String replyEnglish;
    private String grammarFeedback;

    public SenseiChatResponse() {}

    public SenseiChatResponse(String replyJapanese, String replyRomaji, String replyEnglish, String grammarFeedback) {
        this.replyJapanese = replyJapanese;
        this.replyRomaji = replyRomaji;
        this.replyEnglish = replyEnglish;
        this.grammarFeedback = grammarFeedback;
    }

    public String getReplyJapanese() {
        return replyJapanese;
    }

    public void setReplyJapanese(String replyJapanese) {
        this.replyJapanese = replyJapanese;
    }

    public String getReplyRomaji() {
        return replyRomaji;
    }

    public void setReplyRomaji(String replyRomaji) {
        this.replyRomaji = replyRomaji;
    }

    public String getReplyEnglish() {
        return replyEnglish;
    }

    public void setReplyEnglish(String replyEnglish) {
        this.replyEnglish = replyEnglish;
    }

    public String getGrammarFeedback() {
        return grammarFeedback;
    }

    public void setGrammarFeedback(String grammarFeedback) {
        this.grammarFeedback = grammarFeedback;
    }
}
