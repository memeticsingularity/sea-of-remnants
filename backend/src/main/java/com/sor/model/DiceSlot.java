package com.sor.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class DiceSlot {

  @JsonProperty("default")
  private String defaultValue;

  private List<String> alternatives = new ArrayList<>();

  public String getDefaultValue() {
    return defaultValue;
  }

  public void setDefaultValue(String defaultValue) {
    this.defaultValue = defaultValue;
  }

  public List<String> getAlternatives() {
    return alternatives;
  }

  public void setAlternatives(List<String> alternatives) {
    this.alternatives = alternatives;
  }
}
