package com.sor.service;

import com.sor.model.BaseEntity;

import java.util.List;

/**
 * 通用实体 Service 接口。
 *
 * 用于简单集合（ships/songs/items/quests/locations/glossary/symptoms/shadows/
 * recruitment-pools/guardians/ship-tags/random-affixes），collectionName 使用 kebab-case。
 */
public interface GenericEntityService {

  List<BaseEntity> list(String collectionName);

  BaseEntity findBySlug(String collectionName, String slug);

  BaseEntity findById(String collectionName, String id);
}
