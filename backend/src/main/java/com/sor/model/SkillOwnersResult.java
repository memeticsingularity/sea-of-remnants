package com.sor.model;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class SkillOwnersResult {

  private List<CrewSummary> crews = new ArrayList<>();
  private List<GameClass> classes = new ArrayList<>();

  public List<CrewSummary> getCrews() {
    return crews;
  }

  public void setCrews(List<CrewSummary> crews) {
    this.crews = crews;
  }

  public List<GameClass> getClasses() {
    return classes;
  }

  public void setClasses(List<GameClass> classes) {
    this.classes = classes;
  }
}
