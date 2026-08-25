package com.sor.model;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class RandomAffixOccurrence {

  private String equipmentId;
  private String equipmentSlug;
  private String equipmentName;
  private Integer level;

  public String getEquipmentId() {
    return equipmentId;
  }

  public void setEquipmentId(String equipmentId) {
    this.equipmentId = equipmentId;
  }

  public String getEquipmentSlug() {
    return equipmentSlug;
  }

  public void setEquipmentSlug(String equipmentSlug) {
    this.equipmentSlug = equipmentSlug;
  }

  public String getEquipmentName() {
    return equipmentName;
  }

  public void setEquipmentName(String equipmentName) {
    this.equipmentName = equipmentName;
  }

  public Integer getLevel() {
    return level;
  }

  public void setLevel(Integer level) {
    this.level = level;
  }
}
