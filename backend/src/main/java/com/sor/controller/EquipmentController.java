package com.sor.controller;

import com.sor.api.ApiResponse;
import com.sor.model.Equipment;
import com.sor.service.EquipmentService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/sor/api")
public class EquipmentController {

  private final EquipmentService equipmentService;

  public EquipmentController(EquipmentService equipmentService) {
    this.equipmentService = equipmentService;
  }

  @GetMapping("/equipment")
  public ApiResponse<List<Equipment>> list() {
    return ApiResponse.ok(equipmentService.list());
  }

  @GetMapping("/equipment/{slug}")
  public ApiResponse<Equipment> getBySlug(@PathVariable String slug) {
    Equipment equipment = equipmentService.findBySlug(slug);
    if (equipment == null) {
      return ApiResponse.error(404, "not found: " + slug);
    }
    return ApiResponse.ok(equipment);
  }
}
