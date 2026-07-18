package com.nihongo.backend.service;

import com.atilika.kuromoji.ipadic.Token;
import com.atilika.kuromoji.ipadic.Tokenizer;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class AnalyzerService {

    private final Tokenizer tokenizer;

    public AnalyzerService() {
        this.tokenizer = new Tokenizer();
    }

    public List<ExtractedWord> analyzeText(String text) {
        List<Token> tokens = tokenizer.tokenize(text);
        List<ExtractedWord> extractedWords = new ArrayList<>();
        Set<String> seenWords = new HashSet<>(); // To avoid duplicates in the result list

        for (Token token : tokens) {
            String pos = token.getPartOfSpeechLevel1();
            
            // Filter out punctuation, particles, auxiliary verbs, and unknown symbols
            if (pos.equals("助詞") || pos.equals("助動詞") || pos.equals("記号") || pos.equals("フィラー") || pos.equals("その他")) {
                continue;
            }

            String baseForm = token.getBaseForm();
            String surface = token.getSurface();
            
            // Some words don't have a base form in Kuromoji (like proper nouns), so fallback to surface
            String wordToUse = (baseForm != null && !baseForm.equals("*")) ? baseForm : surface;
            
            // Skip single hiragana letters or very short meaningless tokens unless they are important
            if (wordToUse.trim().isEmpty()) continue;

            if (!seenWords.contains(wordToUse)) {
                seenWords.add(wordToUse);
                
                ExtractedWord ew = new ExtractedWord();
                ew.setWord(wordToUse);
                ew.setReading(token.getReading() != null && !token.getReading().equals("*") ? token.getReading() : "");
                ew.setPartOfSpeech(pos);
                extractedWords.add(ew);
            }
        }

        return extractedWords;
    }

    public static class ExtractedWord {
        private String word;
        private String reading;
        private String partOfSpeech;

        public String getWord() { return word; }
        public void setWord(String word) { this.word = word; }
        public String getReading() { return reading; }
        public void setReading(String reading) { this.reading = reading; }
        public String getPartOfSpeech() { return partOfSpeech; }
        public void setPartOfSpeech(String partOfSpeech) { this.partOfSpeech = partOfSpeech; }
    }
}
