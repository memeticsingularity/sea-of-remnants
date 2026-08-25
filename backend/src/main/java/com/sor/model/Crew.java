package com.sor.model;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Crew extends BaseEntity {

  private String rarity;
  private String role;
  private String element;
  private String faction;
  private String camp;
  private String obtain;
  private String availability;
  private String versionAdded;
  private String favoriteFood;
  private String introduction;
  private String image;
  private String buildNotes;

  private List<String> tags = new ArrayList<>();
  private Map<String, Integer> baseStats = new HashMap<>();
  private Map<String, Integer> maxStats = new HashMap<>();
  private List<String> skills = new ArrayList<>();
  private List<String> songs = new ArrayList<>();
  private List<String> recommendedEquipment = new ArrayList<>();
  private List<LoreEntry> lore = new ArrayList<>();
  private List<StatGrowthEntry> statGrowth = new ArrayList<>();
  private List<TrainingPhase> training = new ArrayList<>();

  public String getRarity() {
    return rarity;
  }

  public void setRarity(String rarity) {
    this.rarity = rarity;
  }

  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public String getElement() {
    return element;
  }

  public void setElement(String element) {
    this.element = element;
  }

  public String getFaction() {
    return faction;
  }

  public void setFaction(String faction) {
    this.faction = faction;
  }

  public String getCamp() {
    return camp;
  }

  public void setCamp(String camp) {
    this.camp = camp;
  }

  public String getObtain() {
    return obtain;
  }

  public void setObtain(String obtain) {
    this.obtain = obtain;
  }

  public String getAvailability() {
    return availability;
  }

  public void setAvailability(String availability) {
    this.availability = availability;
  }

  public String getVersionAdded() {
    return versionAdded;
  }

  public void setVersionAdded(String versionAdded) {
    this.versionAdded = versionAdded;
  }

  public String getFavoriteFood() {
    return favoriteFood;
  }

  public void setFavoriteFood(String favoriteFood) {
    this.favoriteFood = favoriteFood;
  }

  public String getIntroduction() {
    return introduction;
  }

  public void setIntroduction(String introduction) {
    this.introduction = introduction;
  }

  public String getImage() {
    return image;
  }

  public void setImage(String image) {
    this.image = image;
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

  public Map<String, Integer> getBaseStats() {
    return baseStats;
  }

  public void setBaseStats(Map<String, Integer> baseStats) {
    this.baseStats = baseStats;
  }

  public Map<String, Integer> getMaxStats() {
    return maxStats;
  }

  public void setMaxStats(Map<String, Integer> maxStats) {
    this.maxStats = maxStats;
  }

  public List<String> getSkills() {
    return skills;
  }

  public void setSkills(List<String> skills) {
    this.skills = skills;
  }

  public List<String> getSongs() {
    return songs;
  }

  public void setSongs(List<String> songs) {
    this.songs = songs;
  }

  public List<String> getRecommendedEquipment() {
    return recommendedEquipment;
  }

  public void setRecommendedEquipment(List<String> recommendedEquipment) {
    this.recommendedEquipment = recommendedEquipment;
  }

  public List<LoreEntry> getLore() {
    return lore;
  }

  public void setLore(List<LoreEntry> lore) {
    this.lore = lore;
  }

  public List<StatGrowthEntry> getStatGrowth() {
    return statGrowth;
  }

  public void setStatGrowth(List<StatGrowthEntry> statGrowth) {
    this.statGrowth = statGrowth;
  }

  public List<TrainingPhase> getTraining() {
    return training;
  }

  public void setTraining(List<TrainingPhase> training) {
    this.training = training;
  }
}
