package com.sor.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sor.model.Equipment;
import com.sor.service.EquipmentService;
import com.sor.service.WikiDataRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 行装 Service 实现。
 */
@Service
public class EquipmentServiceImpl implements EquipmentService {

  private static final String COLLECTION_KEY = "equipment";

  private final WikiDataRepository wikiDataRepository;
  private final ObjectMapper objectMapper;

  public EquipmentServiceImpl(WikiDataRepository wikiDataRepository, ObjectMapper objectMapper) {
    this.wikiDataRepository = wikiDataRepository;
    this.objectMapper = objectMapper;
  }

  @Override
  public List<Equipment> list() {
    return wikiDataRepository.list(COLLECTION_KEY).stream()
        .map(node -> objectMapper.convertValue(node, Equipment.class))
        .toList();
  }

  @Override
  public Equipment findBySlug(String slug) {
    JsonNode node = wikiDataRepository.findBySlug(COLLECTION_KEY, slug);
    return node == null ? null : objectMapper.convertValue(node, Equipment.class);
  }

  @Override
  public Equipment findById(String id) {
    JsonNode node = wikiDataRepository.findById(COLLECTION_KEY, id);
    return node == null ? null : objectMapper.convertValue(node, Equipment.class);
  }
}
