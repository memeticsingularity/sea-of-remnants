package com.sor.model;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class TagRequirement {

  private String tag;
  private Integer required;
  private Integer owned;

  public String getTag() {
    return tag;
  }

  public void setTag(String tag) {
    this.tag = tag;
  }

  public Integer getRequired() {
    return required;
  }

  public void setRequired(Integer required) {
    this.required = required;
  }

  public Integer getOwned() {
    return owned;
  }

  public void setOwned(Integer owned) {
    this.owned = owned;
  }
}
