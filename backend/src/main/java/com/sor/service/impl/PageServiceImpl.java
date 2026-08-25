package com.sor.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sor.model.Page;
import com.sor.service.PageService;
import com.sor.service.WikiDataRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Markdown 页面 Service 实现，操作 pages 派生集合。
 */
@Service
public class PageServiceImpl implements PageService {

  private static final String COLLECTION = "pages";

  private final WikiDataRepository wikiDataRepository;
  private final ObjectMapper objectMapper;

  public PageServiceImpl(WikiDataRepository wikiDataRepository, ObjectMapper objectMapper) {
    this.wikiDataRepository = wikiDataRepository;
    this.objectMapper = objectMapper;
  }

  @Override
  public List<Page> listAll() {
    List<JsonNode> nodes = wikiDataRepository.list(COLLECTION);
    if (nodes.isEmpty()) {
      return Collections.emptyList();
    }
    return nodes.stream()
        .map(node -> objectMapper.convertValue(node, Page.class))
        .collect(Collectors.toList());
  }

  @Override
  public Page findById(String id) {
    JsonNode node = wikiDataRepository.findById(COLLECTION, id);
    return node == null ? null : objectMapper.convertValue(node, Page.class);
  }
}
