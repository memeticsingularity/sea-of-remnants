package com.sor.model;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class EnhanceRequirementEntry {

  private Integer level;
  private final Map<String, Number> stats = new HashMap<>();

  public Integer getLevel() {
    return level;
  }

  public void setLevel(Integer level) {
    this.level = level;
  }

  @JsonAnyGetter
  public Map<String, Number> getStats() {
    return stats;
  }

  @JsonAnySetter
  public void setStat(String key, Number value) {
    this.stats.put(key, value);
  }
}
