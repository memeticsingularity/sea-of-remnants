package com.sor.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sor.model.Skill;
import com.sor.model.SkillOwnersResult;
import com.sor.service.SkillService;
import com.sor.service.WikiDataRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillServiceImpl implements SkillService {

  private final WikiDataRepository repository;
  private final ObjectMapper objectMapper;

  public SkillServiceImpl(WikiDataRepository repository, ObjectMapper objectMapper) {
    this.repository = repository;
    this.objectMapper = objectMapper;
  }

  @Override
  public List<Skill> list() {
    return repository.list("skills").stream()
        .map(node -> objectMapper.convertValue(node, Skill.class))
        .toList();
  }

  @Override
  public Skill findBySlug(String slug) {
    JsonNode node = repository.findBySlug("skills", slug);
    if (node == null || node.isNull()) {
      return null;
    }
    return objectMapper.convertValue(node, Skill.class);
  }

  @Override
  public Skill findById(String id) {
    JsonNode node = repository.findById("skills", id);
    if (node == null || node.isNull()) {
      return null;
    }
    return objectMapper.convertValue(node, Skill.class);
  }

  @Override
  public SkillOwnersResult findOwners(String slug) {
    Skill skill = findBySlug(slug);
    if (skill == null || skill.getId() == null) {
      return null;
    }
    JsonNode resultNode = repository.skillOwners(skill.getId());
    if (resultNode == null || resultNode.isNull()) {
      return null;
    }
    return objectMapper.convertValue(resultNode, SkillOwnersResult.class);
  }
}
