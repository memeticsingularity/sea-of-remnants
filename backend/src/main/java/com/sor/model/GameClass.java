package com.sor.model;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class GameClass extends BaseEntity {

  private String tier;
  private String role;
  private String description;
  private String unlockCondition;
  private String image;
  private String attributeBoost;
  private String buildNotes;

  private List<String> combatRoles = new ArrayList<>();
  private List<String> skills = new ArrayList<>();
  private List<String> songs = new ArrayList<>();
  private List<ClassPassive> passives = new ArrayList<>();

  private TagRequirement tagRequirement;
  private Integer talentPoints;
  private Map<String, String> statBoosts;

  public String getTier() {
    return tier;
  }

  public void setTier(String tier) {
    this.tier = tier;
  }

  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getUnlockCondition() {
    return unlockCondition;
  }

  public void setUnlockCondition(String unlockCondition) {
    this.unlockCondition = unlockCondition;
  }

  public String getImage() {
    return image;
  }

  public void setImage(String image) {
    this.image = image;
  }

  public String getAttributeBoost() {
    return attributeBoost;
  }

  public void setAttributeBoost(String attributeBoost) {
    this.attributeBoost = attributeBoost;
  }

  public String getBuildNotes() {
    return buildNotes;
  }

  public void setBuildNotes(String buildNotes) {
    this.buildNotes = buildNotes;
  }

  public List<String> getCombatRoles() {
    return combatRoles;
  }

  public void setCombatRoles(List<String> combatRoles) {
    this.combatRoles = combatRoles;
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

  public List<ClassPassive> getPassives() {
    return passives;
  }

  public void setPassives(List<ClassPassive> passives) {
    this.passives = passives;
  }

  public TagRequirement getTagRequirement() {
    return tagRequirement;
  }

  public void setTagRequirement(TagRequirement tagRequirement) {
    this.tagRequirement = tagRequirement;
  }

  public Integer getTalentPoints() {
    return talentPoints;
  }

  public void setTalentPoints(Integer talentPoints) {
    this.talentPoints = talentPoints;
  }

  public Map<String, String> getStatBoosts() {
    return statBoosts;
  }

  public void setStatBoosts(Map<String, String> statBoosts) {
    this.statBoosts = statBoosts;
  }
}
