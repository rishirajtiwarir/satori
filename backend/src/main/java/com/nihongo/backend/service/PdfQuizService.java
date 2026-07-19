package com.nihongo.backend.service;

import com.nihongo.backend.entity.GeneratedQuiz;
import com.nihongo.backend.entity.GeneratedQuizQuestion;
import com.nihongo.backend.entity.User;
import com.nihongo.backend.repository.GeneratedQuizRepository;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class PdfQuizService {

    private final AnalyzerService analyzerService;
    private final GeneratedQuizRepository generatedQuizRepository;
    private final Random random = new Random();

    public PdfQuizService(AnalyzerService analyzerService, GeneratedQuizRepository generatedQuizRepository) {
        this.analyzerService = analyzerService;
        this.generatedQuizRepository = generatedQuizRepository;
    }

    public GeneratedQuiz generateQuizFromPdf(MultipartFile file, User user) throws Exception {
        String text = extractTextFromPdf(file.getInputStream());
        
        List<AnalyzerService.ExtractedWord> words = analyzerService.analyzeText(text);
        
        // Filter out words that are too short or lacking proper meaning/reading if possible.
        // For simplicity, we just use words that have a valid reading.
        List<AnalyzerService.ExtractedWord> validWords = new ArrayList<>();
        for (AnalyzerService.ExtractedWord w : words) {
            if (w.getReading() != null && !w.getReading().trim().isEmpty() && !w.getWord().equals(w.getReading())) {
                validWords.add(w);
            }
        }
        
        // Shuffle and limit to 10 questions max to not overwhelm
        Collections.shuffle(validWords);
        int limit = Math.min(10, validWords.size());
        
        GeneratedQuiz quiz = new GeneratedQuiz(user, "Quiz from " + file.getOriginalFilename(), LocalDateTime.now());
        
        for (int i = 0; i < limit; i++) {
            AnalyzerService.ExtractedWord targetWord = validWords.get(i);
            GeneratedQuizQuestion q = generateQuestion(targetWord, validWords);
            quiz.addQuestion(q);
        }
        
        return generatedQuizRepository.save(quiz);
    }

    private String extractTextFromPdf(InputStream inputStream) throws Exception {
        byte[] bytes = inputStream.readAllBytes();
        try (PDDocument document = Loader.loadPDF(new org.apache.pdfbox.io.RandomAccessReadBuffer(bytes))) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private GeneratedQuizQuestion generateQuestion(AnalyzerService.ExtractedWord target, List<AnalyzerService.ExtractedWord> allWords) {
        GeneratedQuizQuestion q = new GeneratedQuizQuestion();
        q.setWord(target.getWord());
        q.setReading(target.getReading());
        // Kuromoji does not provide English meaning out of the box, so we use PartOfSpeech as meaning or a placeholder.
        // In a real scenario, this would hook into a dictionary API.
        q.setMeaning("Type: " + target.getPartOfSpeech());
        
        List<String> options = new ArrayList<>();
        options.add(target.getReading()); // Correct option
        
        // Generate 3 wrong options
        Set<String> wrongOptions = new HashSet<>();
        while (wrongOptions.size() < 3 && wrongOptions.size() < allWords.size() - 1) {
            AnalyzerService.ExtractedWord randWord = allWords.get(random.nextInt(allWords.size()));
            if (!randWord.getReading().equals(target.getReading()) && !wrongOptions.contains(randWord.getReading())) {
                wrongOptions.add(randWord.getReading());
            }
        }
        options.addAll(wrongOptions);
        Collections.shuffle(options);
        
        q.setOption1(options.size() > 0 ? options.get(0) : target.getReading());
        q.setOption2(options.size() > 1 ? options.get(1) : target.getReading());
        q.setOption3(options.size() > 2 ? options.get(2) : target.getReading());
        q.setOption4(options.size() > 3 ? options.get(3) : target.getReading());
        q.setCorrectOptionIndex(options.indexOf(target.getReading()));
        
        return q;
    }
}
