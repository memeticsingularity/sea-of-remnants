package com.sor.model;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class DiceLevelDetail {

  private Integer level;
  private String detailedDesc;

  public Integer getLevel() {
    return level;
  }

  public void setLevel(Integer level) {
    this.level = level;
  }

  public String getDetailedDesc() {
    return detailedDesc;
  }

  public void setDetailedDesc(String detailedDesc) {
    this.detailedDesc = detailedDesc;
  }
}
