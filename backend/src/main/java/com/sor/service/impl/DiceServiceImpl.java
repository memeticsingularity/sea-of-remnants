package com.sor.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sor.model.Dice;
import com.sor.service.DiceService;
import com.sor.service.WikiDataRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 骰子/辅助技 Service 实现。
 */
@Service
public class DiceServiceImpl implements DiceService {

  private static final String COLLECTION_KEY = "dice";

  private final WikiDataRepository wikiDataRepository;
  private final ObjectMapper objectMapper;

  public DiceServiceImpl(WikiDataRepository wikiDataRepository, ObjectMapper objectMapper) {
    this.wikiDataRepository = wikiDataRepository;
    this.objectMapper = objectMapper;
  }

  @Override
  public List<Dice> list() {
    return wikiDataRepository.list(COLLECTION_KEY).stream()
        .map(node -> objectMapper.convertValue(node, Dice.class))
        .toList();
  }

  @Override
  public Dice findBySlug(String slug) {
    JsonNode node = wikiDataRepository.findBySlug(COLLECTION_KEY, slug);
    return node == null ? null : objectMapper.convertValue(node, Dice.class);
  }

  @Override
  public Dice findById(String id) {
    JsonNode node = wikiDataRepository.findById(COLLECTION_KEY, id);
    return node == null ? null : objectMapper.convertValue(node, Dice.class);
  }
}
