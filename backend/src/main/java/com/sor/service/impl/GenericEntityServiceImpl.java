package com.sor.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sor.model.BaseEntity;
import com.sor.service.GenericEntityService;
import com.sor.service.WikiDataRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 通用实体 Service 实现。
 */
@Service
public class GenericEntityServiceImpl implements GenericEntityService {

  private static final Set<String> ALLOWED_COLLECTIONS = Set.of(
      "ships", "songs", "items", "quests", "locations", "glossary",
      "symptoms", "shadows", "recruitment-pools", "guardians",
      "ship-tags", "random-affixes");

  private final WikiDataRepository wikiDataRepository;
  private final ObjectMapper objectMapper;

  public GenericEntityServiceImpl(WikiDataRepository wikiDataRepository, ObjectMapper objectMapper) {
    this.wikiDataRepository = wikiDataRepository;
    this.objectMapper = objectMapper;
  }

  @Override
  public List<BaseEntity> list(String collectionName) {
    validateCollection(collectionName);
    String key = WikiDataRepositoryImpl.toCamel(collectionName);
    List<JsonNode> nodes = wikiDataRepository.list(key);
    if (nodes.isEmpty()) {
      return Collections.emptyList();
    }
    return nodes.stream()
        .map(node -> objectMapper.convertValue(node, BaseEntity.class))
        .collect(Collectors.toList());
  }

  @Override
  public BaseEntity findBySlug(String collectionName, String slug) {
    validateCollection(collectionName);
    String key = WikiDataRepositoryImpl.toCamel(collectionName);
    JsonNode node = wikiDataRepository.findBySlug(key, slug);
    return node == null ? null : objectMapper.convertValue(node, BaseEntity.class);
  }

  @Override
  public BaseEntity findById(String collectionName, String id) {
    validateCollection(collectionName);
    String key = WikiDataRepositoryImpl.toCamel(collectionName);
    JsonNode node = wikiDataRepository.findById(key, id);
    return node == null ? null : objectMapper.convertValue(node, BaseEntity.class);
  }

  private void validateCollection(String collectionName) {
    if (collectionName == null || !ALLOWED_COLLECTIONS.contains(collectionName)) {
      throw new IllegalArgumentException("Invalid collection: " + collectionName);
    }
  }
}
