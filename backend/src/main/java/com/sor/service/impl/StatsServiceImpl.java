package com.sor.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sor.service.StatsService;
import com.sor.service.WikiDataRepository;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * 统计 Service 实现。
 */
@Service
public class StatsServiceImpl implements StatsService {

  private final WikiDataRepository wikiDataRepository;
  private final ObjectMapper objectMapper;

  public StatsServiceImpl(WikiDataRepository wikiDataRepository, ObjectMapper objectMapper) {
    this.wikiDataRepository = wikiDataRepository;
    this.objectMapper = objectMapper;
  }

  @Override
  public Map<String, Integer> stats() {
    return wikiDataRepository.stats();
  }
}
