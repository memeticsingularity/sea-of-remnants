package com.sor.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.sor.api.ApiResponse;
import com.sor.service.WikiDataService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class WikiController {

  private final WikiDataService wikiDataService;

  public WikiController(WikiDataService wikiDataService) {
    this.wikiDataService = wikiDataService;
  }

  @GetMapping("/{collection}")
  public ApiResponse<List<JsonNode>> list(@PathVariable String collection) {
    if (!wikiDataService.isValidCollection(collection)) {
      return ApiResponse.error(400, "unknown collection: " + collection);
    }
    return ApiResponse.ok(wikiDataService.list(collection));
  }

  @GetMapping("/{collection}/{slug}")
  public ApiResponse<JsonNode> getBySlug(@PathVariable String collection, @PathVariable String slug) {
    if (!wikiDataService.isValidCollection(collection)) {
      return ApiResponse.error(400, "unknown collection: " + collection);
    }
    JsonNode node = wikiDataService.findBySlug(collection, slug);
    if (node == null) {
      return ApiResponse.error(404, "not found: " + slug);
    }
    return ApiResponse.ok(node);
  }

  @GetMapping("/stats")
  public ApiResponse<Map<String, Integer>> stats() {
    return ApiResponse.ok(wikiDataService.stats());
  }

  @GetMapping("/searchIndex")
  public ApiResponse<JsonNode> searchIndex() {
    return ApiResponse.ok(wikiDataService.searchIndex());
  }

  @GetMapping("/skills/{slug}/owners")
  public ApiResponse<JsonNode> skillOwners(@PathVariable String slug) {
    return ApiResponse.ok(wikiDataService.skillOwners(slug));
  }
}
