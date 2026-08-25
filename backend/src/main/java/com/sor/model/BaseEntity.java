package com.sor.model;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.HashMap;
import java.util.Map;

/**
 * 通用实体基类。
 *
 * 简单集合（ships/songs/items/quests/locations/glossary/symptoms/shadows/
 * recruitment-pools/guardians/ship-tags/random-affixes）直接反序列化为 BaseEntity，
 * 除 id/slug/name/type 外的字段进入 extra，通过 @JsonAnyGetter 平铺到 JSON 顶层，
 * 保证前端反序列化无感知。
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BaseEntity {

  private String id;
  private String slug;
  private String name;
  private String type;

  private final Map<String, Object> extra = new HashMap<>();

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getSlug() {
    return slug;
  }

  public void setSlug(String slug) {
    this.slug = slug;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  @JsonAnyGetter
  public Map<String, Object> getExtra() {
    return extra;
  }

  @JsonAnySetter
  public void setExtra(String key, Object value) {
    this.extra.put(key, value);
  }
}
