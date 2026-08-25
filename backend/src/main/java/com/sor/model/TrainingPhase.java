package com.sor.model;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class TrainingPhase {

  private String phase;
  private Map<String, String> bonuses = new HashMap<>();
  private List<MaterialCost> materials = new ArrayList<>();

  public String getPhase() {
    return phase;
  }

  public void setPhase(String phase) {
    this.phase = phase;
  }

  public Map<String, String> getBonuses() {
    return bonuses;
  }

  public void setBonuses(Map<String, String> bonuses) {
    this.bonuses = bonuses;
  }

  public List<MaterialCost> getMaterials() {
    return materials;
  }

  public void setMaterials(List<MaterialCost> materials) {
    this.materials = materials;
  }
}
