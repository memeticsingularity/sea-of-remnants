package com.sor.model;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class MaxEnhanceEntry {

  private Integer fruitLevel;
  private Integer maxEnhance;

  public Integer getFruitLevel() {
    return fruitLevel;
  }

  public void setFruitLevel(Integer fruitLevel) {
    this.fruitLevel = fruitLevel;
  }

  public Integer getMaxEnhance() {
    return maxEnhance;
  }

  public void setMaxEnhance(Integer maxEnhance) {
    this.maxEnhance = maxEnhance;
  }
}
