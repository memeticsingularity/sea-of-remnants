package com.sor.controller;

import com.sor.api.ApiResponse;
import com.sor.model.Page;
import com.sor.service.PageService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/sor/api")
public class PageController {

  private final PageService pageService;

  public PageController(PageService pageService) {
    this.pageService = pageService;
  }

  @GetMapping("/pages")
  public ApiResponse<List<Page>> list() {
    return ApiResponse.ok(pageService.listAll());
  }

  @GetMapping("/pages/{id}")
  public ApiResponse<Page> getById(@PathVariable String id) {
    Page page = pageService.findById(id);
    if (page == null) {
      return ApiResponse.error(404, "not found: " + id);
    }
    return ApiResponse.ok(page);
  }
}
