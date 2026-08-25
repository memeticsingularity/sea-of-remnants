package com.sor.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.sor.service.WikiDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class WikiController {

  private final WikiDataService wikiDataService;

  public WikiController(WikiDataService wikiDataService) {
    this.wikiDataService = wikiDataService;
  }

  @GetMapping("/{collection}")
  public List<JsonNode> list(@PathVariable String collection) {
    return wikiDataService.list(collection);
  }

  @GetMapping("/{collection}/{slug}")
  public ResponseEntity<JsonNode> getBySlug(
      @PathVariable String collection,
      @PathVariable String slug) {
    JsonNode node = wikiDataService.findBySlug(collection, slug);
    if (node == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(node);
  }
}
