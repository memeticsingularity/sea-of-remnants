package com.sor.model;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Equipment extends BaseEntity {

  private String slot;
  private String handType;
  private String rarity;
  private String set;
  private String flavor;
  private String image;
  private String source;
  private String buildNotes;

  private List<String> tags = new ArrayList<>();
  private List<String> fixedAffixes = new ArrayList<>();
  private List<String> randomAffixes = new ArrayList<>();
  private List<String> randomAffixIds = new ArrayList<>();

  private Integer enhance;
  private List<MaxEnhanceEntry> maxEnhanceByFruitLevel = new ArrayList<>();

  private Map<String, Object> baseStats;
  private Map<String, Map<String, Object>> statsByLevel;
  private Map<String, Object> requirements;

  private List<EnhanceRequirementEntry> enhanceRequirements = new ArrayList<>();
  private List<SetBonusEntry> setBonus = new ArrayList<>();

  public String getSlot() {
    return slot;
  }

  public void setSlot(String slot) {
    this.slot = slot;
  }

  public String getHandType() {
    return handType;
  }

  public void setHandType(String handType) {
    this.handType = handType;
  }

  public String getRarity() {
    return rarity;
  }

  public void setRarity(String rarity) {
    this.rarity = rarity;
  }

  public String getSet() {
    return set;
  }

  public void setSet(String set) {
    this.set = set;
  }

  public String getFlavor() {
    return flavor;
  }

  public void setFlavor(String flavor) {
    this.flavor = flavor;
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

  public List<String> getFixedAffixes() {
    return fixedAffixes;
  }

  public void setFixedAffixes(List<String> fixedAffixes) {
    this.fixedAffixes = fixedAffixes;
  }

  public List<String> getRandomAffixes() {
    return randomAffixes;
  }

  public void setRandomAffixes(List<String> randomAffixes) {
    this.randomAffixes = randomAffixes;
  }

  public List<String> getRandomAffixIds() {
    return randomAffixIds;
  }

  public void setRandomAffixIds(List<String> randomAffixIds) {
    this.randomAffixIds = randomAffixIds;
  }

  public Integer getEnhance() {
    return enhance;
  }

  public void setEnhance(Integer enhance) {
    this.enhance = enhance;
  }

  public List<MaxEnhanceEntry> getMaxEnhanceByFruitLevel() {
    return maxEnhanceByFruitLevel;
  }

  public void setMaxEnhanceByFruitLevel(List<MaxEnhanceEntry> maxEnhanceByFruitLevel) {
    this.maxEnhanceByFruitLevel = maxEnhanceByFruitLevel;
  }

  public Map<String, Object> getBaseStats() {
    return baseStats;
  }

  public void setBaseStats(Map<String, Object> baseStats) {
    this.baseStats = baseStats;
  }

  public Map<String, Map<String, Object>> getStatsByLevel() {
    return statsByLevel;
  }

  public void setStatsByLevel(Map<String, Map<String, Object>> statsByLevel) {
    this.statsByLevel = statsByLevel;
  }

  public Map<String, Object> getRequirements() {
    return requirements;
  }

  public void setRequirements(Map<String, Object> requirements) {
    this.requirements = requirements;
  }

  public List<EnhanceRequirementEntry> getEnhanceRequirements() {
    return enhanceRequirements;
  }

  public void setEnhanceRequirements(List<EnhanceRequirementEntry> enhanceRequirements) {
    this.enhanceRequirements = enhanceRequirements;
  }

  public List<SetBonusEntry> getSetBonus() {
    return setBonus;
  }

  public void setSetBonus(List<SetBonusEntry> setBonus) {
    this.setBonus = setBonus;
  }
}
