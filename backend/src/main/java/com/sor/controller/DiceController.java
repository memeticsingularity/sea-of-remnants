package com.sor.controller;

import com.sor.api.ApiResponse;
import com.sor.model.Dice;
import com.sor.service.DiceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/sor/api")
public class DiceController {

  private final DiceService diceService;

  public DiceController(DiceService diceService) {
    this.diceService = diceService;
  }

  @GetMapping("/dice")
  public ApiResponse<List<Dice>> list() {
    return ApiResponse.ok(diceService.list());
  }

  @GetMapping("/dice/{slug}")
  public ApiResponse<Dice> getBySlug(@PathVariable String slug) {
    Dice dice = diceService.findBySlug(slug);
    if (dice == null) {
      return ApiResponse.error(404, "not found: " + slug);
    }
    return ApiResponse.ok(dice);
  }
}
