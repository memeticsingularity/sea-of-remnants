package com.sor.controller;

import com.sor.api.ApiResponse;
import com.sor.model.Crew;
import com.sor.model.CrewSummary;
import com.sor.service.CrewService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/sor/api")
public class CrewController {

  private final CrewService crewService;

  public CrewController(CrewService crewService) {
    this.crewService = crewService;
  }

  @GetMapping("/crews")
  public ApiResponse<List<Crew>> list() {
    return ApiResponse.ok(crewService.list());
  }

  @GetMapping("/crews/summary")
  public ApiResponse<List<CrewSummary>> summary() {
    return ApiResponse.ok(crewService.findSummaries());
  }

  @GetMapping("/crews/{slug}")
  public ApiResponse<Crew> getBySlug(@PathVariable String slug) {
    Crew crew = crewService.findBySlug(slug);
    if (crew == null) {
      return ApiResponse.error(404, "not found: " + slug);
    }
    return ApiResponse.ok(crew);
  }
}
