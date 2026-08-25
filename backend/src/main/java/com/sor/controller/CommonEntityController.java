package com.sor.controller;

import com.sor.api.ApiResponse;
import com.sor.model.BaseEntity;
import com.sor.service.GenericEntityService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/sor/api")
public class CommonEntityController {

  private final GenericEntityService genericEntityService;

  public CommonEntityController(GenericEntityService genericEntityService) {
    this.genericEntityService = genericEntityService;
  }

  @GetMapping("/{collection}")
  public ApiResponse<List<BaseEntity>> list(@PathVariable String collection) {
    try {
      return ApiResponse.ok(genericEntityService.list(collection));
    } catch (IllegalArgumentException e) {
      return ApiResponse.error(400, e.getMessage());
    }
  }

  @GetMapping("/{collection}/{slug}")
  public ApiResponse<BaseEntity> getBySlug(@PathVariable String collection,
                                           @PathVariable String slug) {
    try {
      BaseEntity entity = genericEntityService.findBySlug(collection, slug);
      if (entity == null) {
        return ApiResponse.error(404, "not found: " + slug);
      }
      return ApiResponse.ok(entity);
    } catch (IllegalArgumentException e) {
      return ApiResponse.error(400, e.getMessage());
    }
  }
}
