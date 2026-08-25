package com.sor.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Skill extends BaseEntity {

  @JsonProperty("class")
  private String className;

  private Integer level;
  private Integer maxLevel;
  private String shortDesc;
  private String detailedDesc;
  private String image;
  private String source;
  private String buildNotes;

  private List<String> tags = new ArrayList<>();
  private Integer extraActions;
  private List<DiceSlot> diceSlots = new ArrayList<>();
  private List<String> relatedGlossary = new ArrayList<>();
  private List<SkillLevelDetail> levelDetails = new ArrayList<>();

  public String getClassName() {
    return className;
  }

  public void setClassName(String className) {
    this.className = className;
  }

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

  public List<String> getTags() {
    return tags;
  }

  public void setTags(List<String> tags) {
    this.tags = tags;
  }

  public Integer getExtraActions() {
    return extraActions;
  }

  public void setExtraActions(Integer extraActions) {
    this.extraActions = extraActions;
  }

  public List<DiceSlot> getDiceSlots() {
    return diceSlots;
  }

  public void setDiceSlots(List<DiceSlot> diceSlots) {
    this.diceSlots = diceSlots;
  }

  public List<String> getRelatedGlossary() {
    return relatedGlossary;
  }

  public void setRelatedGlossary(List<String> relatedGlossary) {
    this.relatedGlossary = relatedGlossary;
  }

  public List<SkillLevelDetail> getLevelDetails() {
    return levelDetails;
  }

  public void setLevelDetails(List<SkillLevelDetail> levelDetails) {
    this.levelDetails = levelDetails;
  }
}
