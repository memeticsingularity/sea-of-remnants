package com.sor.controller;

import com.sor.api.ApiResponse;
import com.sor.service.StatsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/sor/api")
public class StatsController {

  private final StatsService statsService;

  public StatsController(StatsService statsService) {
    this.statsService = statsService;
  }

  @GetMapping("/stats")
  public ApiResponse<Map<String, Integer>> stats() {
    return ApiResponse.ok(statsService.stats());
  }
}
