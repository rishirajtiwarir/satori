package com.nihongo.backend.repository;

import com.nihongo.backend.entity.SavedWord;
import com.nihongo.backend.entity.VocabularyList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavedWordRepository extends JpaRepository<SavedWord, Long> {
    List<SavedWord> findByVocabularyListOrderBySavedAtDesc(VocabularyList vocabularyList);
}
