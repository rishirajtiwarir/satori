package com.nihongo.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nihongo.backend.dto.SenseiChatRequest;
import com.nihongo.backend.dto.SenseiChatResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
public class AiSenseiService {

    @Value("${gemini.api.key:}")
    private String defaultApiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();

    public SenseiChatResponse processChat(SenseiChatRequest request) {
        String apiKey = (request.getApiKey() != null && !request.getApiKey().trim().isEmpty()) 
                        ? request.getApiKey().trim() : defaultApiKey;
        String scenario = request.getScenario() != null ? request.getScenario().toLowerCase() : "free_talk";
        String message = request.getMessage() != null ? request.getMessage().trim() : "";

        if (apiKey != null && !apiKey.isEmpty() && !apiKey.equalsIgnoreCase("YOUR_GEMINI_API_KEY")) {
            try {
                SenseiChatResponse aiResponse = callGeminiApi(apiKey, scenario, message);
                if (aiResponse != null && aiResponse.getReplyJapanese() != null) {
                    return aiResponse;
                }
            } catch (Exception e) {
                System.err.println("Gemini API call failed or timed out. Gracefully degrading to smart Sensei simulator: " + e.getMessage());
            }
        }

        return getSmartFallbackResponse(scenario, message);
    }

    private SenseiChatResponse callGeminiApi(String apiKey, String scenario, String userMessage) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

        String scenarioPrompt = switch (scenario) {
            case "ramen_order" -> "Scenario: Customer ordering ramen at an Izakaya in Shibuya. You play the friendly waiter.";
            case "station_ticket" -> "Scenario: Traveler asking for train directions and ticket help at bustling Shinjuku Station. You play the helpful station attendant.";
            case "konbini" -> "Scenario: Shopping at a Japanese Konbini (7-Eleven/Lawson) asking for items or warming up bento. You play the cashier.";
            case "job_interview" -> "Scenario: First day at a Tokyo workplace. Self-introduction (Jikoukai) and formal honorifics (Keigo) practice. You play the welcoming senior supervisor.";
            default -> "Scenario: Casual Japanese conversation and language mentoring with Sakura Sensei.";
        };

        String systemPrompt = "You are Sakura Sensei (さくら先生), a kind, cheerful, and highly skilled Japanese language teacher on the Satori platform. " +
                scenarioPrompt + "\n" +
                "The student just said: \"" + userMessage + "\"\n" +
                "Please respond taking on the persona required by the scenario while also serving as their language coach.\n" +
                "IMPORTANT: Respond strictly in VALID JSON format ONLY, without markdown code fences or commentary outside JSON. Use exactly these keys:\n" +
                "- \"replyJapanese\": Your reply in natural Japanese (using common Kanji and Hiragana/Katakana, 1-2 sentences).\n" +
                "- \"replyRomaji\": The accurate Romaji transcription of your reply.\n" +
                "- \"replyEnglish\": The accurate English translation of your reply.\n" +
                "- \"grammarFeedback\": Friendly encouraging feedback in clear English on the student's grammar, vocabulary, or honorifics. Praise correct structures and gently provide tips or natural Tokyo native phrasing alternatives!";

        Map<String, Object> part = new HashMap<>();
        part.put("text", systemPrompt);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", new Object[]{ part });

        Map<String, Object> payload = new HashMap<>();
        payload.put("contents", new Object[]{ content });

        String requestBody = objectMapper.writeValueAsString(payload);

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .timeout(Duration.ofSeconds(15))
                .build();

        HttpResponse<String> httpResponse = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

        if (httpResponse.statusCode() == 200) {
            JsonNode rootNode = objectMapper.readTree(httpResponse.body());
            JsonNode textNode = rootNode.path("candidates").path(0).path("content").path("parts").path(0).path("text");
            if (!textNode.isMissingNode()) {
                String rawJson = textNode.asText();
                // Clean markdown code blocks if Gemini wraps it
                if (rawJson.startsWith("```json")) {
                    rawJson = rawJson.substring(7);
                } else if (rawJson.startsWith("```")) {
                    rawJson = rawJson.substring(3);
                }
                if (rawJson.endsWith("```")) {
                    rawJson = rawJson.substring(0, rawJson.length() - 3);
                }
                rawJson = rawJson.trim();
                return objectMapper.readValue(rawJson, SenseiChatResponse.class);
            }
        }
        return null;
    }

    private SenseiChatResponse getSmartFallbackResponse(String scenario, String message) {
        String msgLower = message.toLowerCase();
        
        switch (scenario) {
            case "ramen_order":
                if (msgLower.contains("ramen") || msgLower.contains("kudasai") || msgLower.contains("onegai") || msgLower.contains("hitotsu") || msgLower.contains("ラーメン")) {
                    return new SenseiChatResponse(
                        "はい、かしこまりました！おすすめのとんこつラーメンですね। 辛さはどうなさいますか？",
                        "Hai, kashikomarimashita! Osusume no tonkotsu ramen desu ne. Karasa wa dou nasaimasu ka?",
                        "Certainly, understood! Our recommended Tonkotsu Ramen right? How spicy would you like it?",
                        "🌸 Sakura Sensei says: Wonderful job ordering! 'Kashikomarimashita' (かしこまりました) is extremely polite service Japanese used by restaurant staff instead of 'Wakarimashita'. Notice how I asked 'dou nasaimasu ka' instead of 'shimasu ka' - that's respectful shop Keigo!"
                    );
                } else if (msgLower.contains("arigatou") || msgLower.contains("gozaimasu") || msgLower.contains("thank") || msgLower.contains("ありがとう")) {
                    return new SenseiChatResponse(
                        "ご来店ありがとうございます！熱いうちにお召し上がりくださいね।",
                        "Goraiten arigatou gozaimasu! Atsui uchi ni omeshiagari kudasai ne.",
                        "Thank you for visiting! Please enjoy it while it's hot.",
                        "🌸 Sakura Sensei says: Excellent politeness! In Japan, expressing gratitude at restaurants is greatly appreciated. When finishing a meal, don't forget to practice saying 'Gochisousama deshita' (ごちそうさまでした - Thank you for the meal)!"
                    );
                } else {
                    return new SenseiChatResponse(
                        "いらっしゃいませ！渋谷いちばん美味しいラーメン店へようこそ！ご注文は何にしますか？",
                        "Irasshaimase! Shibuya ichiban oishii ramen-ten e youkoso! Gochuumon wa nani ni shimasu ka?",
                        "Welcome! Welcome to Shibuya's most delicious ramen shop! What would you like to order?",
                        "🌸 Sakura Sensei says: You can try ordering by stating the item plus 'o kudasai' (～をください - Please give me...). For example, try typing or speaking into your microphone: 'Tonkotsu ramen o kudasai' (とんこつラーメンをください)!"
                    );
                }

            case "station_ticket":
                if (msgLower.contains("doko") || msgLower.contains("where") || msgLower.contains("ikura") || msgLower.contains("how much") || msgLower.contains("どこ") || msgLower.contains("いくら")) {
                    return new SenseiChatResponse(
                        "山手線のホームは３番線になります। 新宿から渋谷までは１૭०円でございます।",
                        "Yamanote-sen no hoomu wa san-ban sen ni narimasu. Shinjuku kara Shibuya made wa hyaku nanajuu en de gozaimasu.",
                        "The Yamanote Line platform is Platform 3. From Shinjuku to Shibuya it costs 170 yen.",
                        "🌸 Sakura Sensei says: Perfect grammar! Using 'doko desu ka' (どこですか - Where is it?) and 'ikura desu ka' (いくらですか - How much is it?) are essential survival expressions at Tokyo train stations. Notice 'de gozaimasu', which train staff use for polite announcements!"
                    );
                } else {
                    return new SenseiChatResponse(
                        "こんにちは！ JR新宿駅のご案内係さくらです। どちらの駅までお越しですか？",
                        "Konnichiwa! JR Shinjuku-eki no go-annai-gari Sakura desu. Dochira no eki made okoshi desu ka?",
                        "Hello! I am Sakura, the JR Shinjuku Station guide attendant. Which station are you heading to?",
                        "🌸 Sakura Sensei says: To respond naturally, try specifying your destination followed by 'made ikitai desu' (～まで行きたいです - I want to go until...). For example: 'Shibuya-eki made ikitai desu'!"
                    );
                }

            case "konbini":
                if (msgLower.contains("bento") || msgLower.contains("hot") || msgLower.contains("atatamete") || msgLower.contains("yes") || msgLower.contains("hai") || msgLower.contains("はい") || msgLower.contains("おべんとう")) {
                    return new SenseiChatResponse(
                        "かしこまりました、お弁当をお温めいたします！ レジ袋はご利用になりますか？",
                        "Kashikomarimashita, obentou o o-atatame itashimasu! Rejibukuro wa goriyou ni narimasu ka?",
                        "Understood, I will warm up your bento box! Would you like to use a plastic shopping bag?",
                        "🌸 Sakura Sensei says: Great vocabulary! In Japanese convenience stores, cashiers rapidly ask about warming bento ('Atatamemasu ka?') and plastic bags ('Rejibukuro'). If you need a bag, reply 'Hai, onegai shimasu'. If not, say 'Iie, kekkou desu' (No thank you)!"
                    );
                } else {
                    return new SenseiChatResponse(
                        "いらっしゃいませ！コンビニサトリへようこそ！ お会計は５૫०円になります। お弁当は温めますか？",
                        "Irasshaimase! Konbini Satori e youkoso! Okaikei wa gohyaku gojuu en ni narimasu. Obentou wa atatamemasu ka?",
                        "Welcome! Welcome to Konbini Satori! Your total bill comes to 550 yen. Shall I warm up your bento box?",
                        "🌸 Sakura Sensei says: Practice responding to the classic cashier question! Try typing or speaking: 'Hai, onegai shimasu' (Yes, please do) or 'Atatamete kudasai' (Please heat it up)!"
                    );
                }

            case "job_interview":
                if (msgLower.contains("hajimemashite") || msgLower.contains("watashi") || msgLower.contains("desu") || msgLower.contains("よろしく") || msgLower.contains("yoroshiku") || msgLower.contains("はじめまして")) {
                    return new SenseiChatResponse(
                        "素晴らしいご挨拶ですね！ 当社へようこそ। 一緒に働けることを嬉しく思います। 質問があれば何でもおっしゃってくださいね।",
                        "Subarashii go-aisatsu desu ne! Tousha e youkoso. Issho ni hatarakeru koto o ureshiku omoi masu. Shitsumon ga areba nandemo osshatte kudasai ne.",
                        "What a wonderful greeting! Welcome to our company. I am delighted that we will work together. If you have any questions, please ask anything.",
                        "🌸 Sakura Sensei says: Exceptionally polite self-introduction (Jikoukai)! Ending with 'Douzo yoroshiku onegai shimasu' (どうぞよろしくお願いします - Pleased to work with you/treat me well) is the gold standard in business Japanese! Notice how seniors use 'osshatte kudasai' as polite Keigo for 'please say/ask'."
                    );
                } else {
                    return new SenseiChatResponse(
                        "おはようございます। 新入社員の皆様の指導係を務めるさくらと申します। まずは簡単な自己紹介をお願いできますか？",
                        "Ohayou gozaimasu. Shinnyuu shain no minasama no shidou-gari o tsutomeru Sakura to moushimasu. Mazu wa kantan na jikoukai o onegai dekimasu ka?",
                        "Good morning. I am Sakura, in charge of guiding new employees. First, could we please have a brief self-introduction from you?",
                        "🌸 Sakura Sensei says: This is formal business setting (Keigo)! Start with 'Hajimemashite' (はじめまして), state your name with '[Your Name] to moushimasu' (～と申します - I am called...), and conclude with 'Yoroshiku onegai shimasu'!"
                    );
                }

            default: // free_talk
                if (msgLower.contains("konnichiwa") || msgLower.contains("ohayou") || msgLower.contains("hello") || msgLower.contains("こんにちは") || msgLower.contains("おはよう")) {
                    return new SenseiChatResponse(
                        "こんにちは！ 今日も日本語の練習を頑張っていて素晴らしいですね！ 今日はどんな物語や単語を勉強したいですか？",
                        "Konnichiwa! Kyou mo nihongo no renshuu o ganbatte ite subarashii desu ne! Kyou wa donna monogatari ya tango o benkyou shitai desu ka?",
                        "Hello! It's wonderful that you are working hard on practicing Japanese again today! What kind of stories or vocabulary would you like to study today?",
                        "🌸 Sakura Sensei says: Friendly greeting! You can express what you want to study using '～o benkyou shitai desu' (～を勉強したいです - I want to study...). You can ask me about grammar, JLPT questions, or everyday idioms!"
                    );
                } else if (msgLower.contains("jlpt") || msgLower.contains("n5") || msgLower.contains("n4") || msgLower.contains("kanji") || msgLower.contains("grammar") || msgLower.contains("かきかた") || msgLower.contains("漢字")) {
                    return new SenseiChatResponse(
                        "JLPTの勉強ですね！毎日少しずつ例文を作ることが一番の秘訣です। 私と一緒に模擬試験の言葉を使っていきましょう！",
                        "JLPT no benkyou desu ne! Mainichi sukoshizutsu reibun o tsukuru koto ga ichiban no hiketsu desu. Watashi to issho ni mogi shiken no kotoba o tsukatte ikimashou!",
                        "Studying for the JLPT! Making practice sentences little by little every day is the number one secret. Let's use words from practical exams together with me!",
                        "🌸 Sakura Sensei says: Consistency is key! Don't forget to try our 'Previous Papers' tab to drop any JLPT practice PDF and extract the words directly into your browser without limits!"
                    );
                } else {
                    return new SenseiChatResponse(
                        "さくら先生です！日本語のことなら何でもお話しくださいね। 今日のお調子はいかがですか？（元気ですか？）",
                        "Sakura-sensei desu! Nihongo no koto nara nandemo ohanashi kudasai ne. Kyou no ochoushi wa ikaga desu ka? (Genki desu ka?)",
                        "It is Sakura Sensei! Please feel free to talk to me about anything related to Japanese. How are you feeling today? (Are you well?)",
                        "🌸 Sakura Sensei says: You can answer how you are feeling! For example: 'Genki desu' (元気です - I am fine!) or 'Sukoshi tsukaremashita' (少し疲れました - I'm a little tired). Speak it into your mic to test your accent!"
                    );
                }
        }
    }
}
