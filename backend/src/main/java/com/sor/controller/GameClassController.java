package com.sor.controller;

import com.sor.api.ApiResponse;
import com.sor.model.GameClass;
import com.sor.service.GameClassService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/sor/api")
public class GameClassController {

  private final GameClassService gameClassService;

  public GameClassController(GameClassService gameClassService) {
    this.gameClassService = gameClassService;
  }

  @GetMapping("/classes")
  public ApiResponse<List<GameClass>> list() {
    return ApiResponse.ok(gameClassService.list());
  }

  @GetMapping("/classes/{slug}")
  public ApiResponse<GameClass> getBySlug(@PathVariable String slug) {
    GameClass gameClass = gameClassService.findBySlug(slug);
    if (gameClass == null) {
      return ApiResponse.error(404, "not found: " + slug);
    }
    return ApiResponse.ok(gameClass);
  }
}
