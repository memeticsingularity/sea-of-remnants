package com.sor.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sor.model.Crew;
import com.sor.model.CrewSummary;
import com.sor.service.CrewService;
import com.sor.service.WikiDataRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CrewServiceImpl implements CrewService {

  private final WikiDataRepository repository;
  private final ObjectMapper objectMapper;

  public CrewServiceImpl(WikiDataRepository repository, ObjectMapper objectMapper) {
    this.repository = repository;
    this.objectMapper = objectMapper;
  }

  @Override
  public List<Crew> list() {
    return repository.list("crews").stream()
        .map(node -> objectMapper.convertValue(node, Crew.class))
        .toList();
  }

  @Override
  public Crew findBySlug(String slug) {
    JsonNode node = repository.findBySlug("crews", slug);
    if (node == null || node.isNull()) {
      return null;
    }
    return objectMapper.convertValue(node, Crew.class);
  }

  @Override
  public Crew findById(String id) {
    JsonNode node = repository.findById("crews", id);
    if (node == null || node.isNull()) {
      return null;
    }
    return objectMapper.convertValue(node, Crew.class);
  }

  @Override
  public List<CrewSummary> findSummaries() {
    return repository.list("crews").stream()
        .map(node -> {
          CrewSummary summary = new CrewSummary();
          summary.setId(node.path("id").asText(null));
          summary.setSlug(node.path("slug").asText(null));
          summary.setName(node.path("name").asText(null));
          summary.setImage(node.path("image").asText(null));
          summary.setElement(node.path("element").asText(null));
          summary.setRarity(node.path("rarity").asText(null));
          summary.setPrimaryStat(node.path("primaryStat").asText(null));
          return summary;
        })
        .toList();
  }
}
