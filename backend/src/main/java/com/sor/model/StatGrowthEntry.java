package com.sor.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class StatGrowthEntry {

  private int phase;

  @JsonProperty("力量")
  private int liLiang;

  @JsonProperty("敏捷")
  private int minJie;

  @JsonProperty("体质")
  private int tiZhi;

  @JsonProperty("智力")
  private int zhiLi;

  @JsonProperty("感知")
  private int ganZhi;

  @JsonProperty("魅力")
  private int meiLi;

  public int getPhase() {
    return phase;
  }

  public void setPhase(int phase) {
    this.phase = phase;
  }

  public int getLiLiang() {
    return liLiang;
  }

  public void setLiLiang(int liLiang) {
    this.liLiang = liLiang;
  }

  public int getMinJie() {
    return minJie;
  }

  public void setMinJie(int minJie) {
    this.minJie = minJie;
  }

  public int getTiZhi() {
    return tiZhi;
  }

  public void setTiZhi(int tiZhi) {
    this.tiZhi = tiZhi;
  }

  public int getZhiLi() {
    return zhiLi;
  }

  public void setZhiLi(int zhiLi) {
    this.zhiLi = zhiLi;
  }

  public int getGanZhi() {
    return ganZhi;
  }

  public void setGanZhi(int ganZhi) {
    this.ganZhi = ganZhi;
  }

  public int getMeiLi() {
    return meiLi;
  }

  public void setMeiLi(int meiLi) {
    this.meiLi = meiLi;
  }
}
