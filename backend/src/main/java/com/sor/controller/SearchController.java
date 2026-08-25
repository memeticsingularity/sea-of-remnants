package com.sor.controller;

import com.sor.api.ApiResponse;
import com.sor.model.SearchIndexEntry;
import com.sor.service.SearchService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/sor/api")
public class SearchController {

  private final SearchService searchService;

  public SearchController(SearchService searchService) {
    this.searchService = searchService;
  }

  @GetMapping("/search")
  public ApiResponse<List<SearchIndexEntry>> list() {
    return ApiResponse.ok(searchService.listAll());
  }
}
