package com.sor.model;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Dice extends BaseEntity {

  private Integer level;
  private Integer maxLevel;
  private String shortDesc;
  private String detailedDesc;
  private String image;
  private String source;
  private String buildNotes;

  private List<String> relatedGlossary = new ArrayList<>();
  private List<DiceLevelDetail> levelDetails = new ArrayList<>();

  public Integer getLevel() {
    return level;
  }

  public void setLevel(Integer level) {
    this.level = level;
  }

  public Integer getMaxLevel() {
    return maxLevel;
  }

  public void setMaxLevel(Integer maxLevel) {
    this.maxLevel = maxLevel;
  }

  public String getShortDesc() {
    return shortDesc;
  }

  public void setShortDesc(String shortDesc) {
    this.shortDesc = shortDesc;
  }

  public String getDetailedDesc() {
    return detailedDesc;
  }

  public void setDetailedDesc(String detailedDesc) {
    this.detailedDesc = detailedDesc;
  }

  public String getImage() {
    return image;
  }

  public void setImage(String image) {
    this.image = image;
  }

  public String getSource() {
    return source;
  }

  public void setSource(String source) {
    this.source = source;
  }

  public String getBuildNotes() {
    return buildNotes;
  }

  public void setBuildNotes(String buildNotes) {
    this.buildNotes = buildNotes;
  }

  public List<String> getRelatedGlossary() {
    return relatedGlossary;
  }

  public void setRelatedGlossary(List<String> relatedGlossary) {
    this.relatedGlossary = relatedGlossary;
  }

  public List<DiceLevelDetail> getLevelDetails() {
    return levelDetails;
  }

  public void setLevelDetails(List<DiceLevelDetail> levelDetails) {
    this.levelDetails = levelDetails;
  }
}
