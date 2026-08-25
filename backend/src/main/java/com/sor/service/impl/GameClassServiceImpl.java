package com.sor.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sor.model.GameClass;
import com.sor.service.GameClassService;
import com.sor.service.WikiDataRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 职业 Service 实现。
 */
@Service
public class GameClassServiceImpl implements GameClassService {

  private static final String COLLECTION_KEY = "classes";

  private final WikiDataRepository wikiDataRepository;
  private final ObjectMapper objectMapper;

  public GameClassServiceImpl(WikiDataRepository wikiDataRepository, ObjectMapper objectMapper) {
    this.wikiDataRepository = wikiDataRepository;
    this.objectMapper = objectMapper;
  }

  @Override
  public List<GameClass> list() {
    return wikiDataRepository.list(COLLECTION_KEY).stream()
        .map(node -> objectMapper.convertValue(node, GameClass.class))
        .toList();
  }

  @Override
  public GameClass findBySlug(String slug) {
    JsonNode node = wikiDataRepository.findBySlug(COLLECTION_KEY, slug);
    return node == null ? null : objectMapper.convertValue(node, GameClass.class);
  }

  @Override
  public GameClass findById(String id) {
    JsonNode node = wikiDataRepository.findById(COLLECTION_KEY, id);
    return node == null ? null : objectMapper.convertValue(node, GameClass.class);
  }
}
