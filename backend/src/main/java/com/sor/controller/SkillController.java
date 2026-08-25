package com.sor.controller;

import com.sor.api.ApiResponse;
import com.sor.model.Skill;
import com.sor.model.SkillOwnersResult;
import com.sor.service.SkillService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/sor/api")
public class SkillController {

  private final SkillService skillService;

  public SkillController(SkillService skillService) {
    this.skillService = skillService;
  }

  @GetMapping("/skills")
  public ApiResponse<List<Skill>> list() {
    return ApiResponse.ok(skillService.list());
  }

  @GetMapping("/skills/{slug}")
  public ApiResponse<Skill> getBySlug(@PathVariable String slug) {
    Skill skill = skillService.findBySlug(slug);
    if (skill == null) {
      return ApiResponse.error(404, "not found: " + slug);
    }
    return ApiResponse.ok(skill);
  }

  @GetMapping("/skills/{slug}/owners")
  public ApiResponse<SkillOwnersResult> owners(@PathVariable String slug) {
    Skill skill = skillService.findBySlug(slug);
    if (skill == null) {
      return ApiResponse.error(404, "not found: " + slug);
    }
    return ApiResponse.ok(skillService.findOwners(slug));
  }
}
