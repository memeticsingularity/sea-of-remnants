package com.sor.service;

import com.fasterxml.jackson.databind.JsonNode;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Wiki 数据仓储层。
 *
 * 负责启动时加载 frontend/content/ 下的 YAML/Markdown，组装成内存 JsonNode（root），
 * 并提供原始集合查询与派生数据（searchIndex、pages.content、randomAffixes.occurrences）。
 * 各领域 Service 在此之上做类型转换与业务封装。
 */
public interface WikiDataRepository {

  void loadData() throws IOException;

  JsonNode getRoot();

  List<JsonNode> list(String collectionKey);

  JsonNode findBySlug(String collectionKey, String slug);

  JsonNode findById(String collectionKey, String id);

  List<String> collectionNames();

  Map<String, Integer> stats();

  boolean isValidCollection(String collection);

  JsonNode searchIndex();

  JsonNode skillOwners(String skillId);
}
