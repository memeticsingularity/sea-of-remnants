package com.sor.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sor.model.SearchIndexEntry;
import com.sor.service.SearchService;
import com.sor.service.WikiDataRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

/**
 * 搜索索引 Service 实现。
 */
@Service
public class SearchServiceImpl implements SearchService {

  private final WikiDataRepository wikiDataRepository;
  private final ObjectMapper objectMapper;

  public SearchServiceImpl(WikiDataRepository wikiDataRepository, ObjectMapper objectMapper) {
    this.wikiDataRepository = wikiDataRepository;
    this.objectMapper = objectMapper;
  }

  @Override
  public List<SearchIndexEntry> listAll() {
    JsonNode index = wikiDataRepository.searchIndex();
    if (index == null || !index.isArray()) {
      return Collections.emptyList();
    }
    return objectMapper.convertValue(index, new TypeReference<List<SearchIndexEntry>>() {});
  }
}
