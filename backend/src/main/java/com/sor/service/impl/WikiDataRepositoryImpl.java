package com.sor.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.NullNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.dataformat.yaml.YAMLMapper;
import com.sor.service.WikiDataRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Wiki 数据仓储实现。
 *
 * 数据真源是 frontend/content/data/ 下的 YAML（构建期由 Maven 拷到 classpath 的 data/yaml/）。
 * 启动时把全部 YAML 组装成一棵内存 JsonNode（root），并复刻 build-content.js 的
 * 派生逻辑（pages.content、random-affixes occurrences 反向索引、searchIndex）。
 */
@Repository
public class WikiDataRepositoryImpl implements WikiDataRepository {

  private static final Logger log = LoggerFactory.getLogger(WikiDataRepositoryImpl.class);

  private final ObjectMapper objectMapper;
  private final YAMLMapper yamlMapper;
  private final PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();

  /** 17 个集合目录（kebab-case），顺序与 frontend/scripts/build-content.js 的 COLLECTIONS 一致 */
  private static final List<String> COLLECTIONS = List.of(
      "crews", "ships", "classes", "skills", "dice", "songs",
      "equipment", "random-affixes", "items", "quests", "locations",
      "glossary", "symptoms", "shadows", "recruitment-pools",
      "guardians", "ship-tags");

  /** 合法集合键（camelCase），用于接口入参白名单 */
  private static final Set<String> VALID_COLLECTIONS;

  static {
    Set<String> set = new HashSet<>();
    for (String c : COLLECTIONS) {
      set.add(toCamel(c));
    }
    // pages 来自 index.yaml（无独立目录），但作为一等派生集合暴露。
    set.add("pages");
    VALID_COLLECTIONS = Collections.unmodifiableSet(set);
  }

  private JsonNode root;

  public WikiDataRepositoryImpl(ObjectMapper objectMapper, YAMLMapper yamlMapper) {
    this.objectMapper = objectMapper;
    this.yamlMapper = yamlMapper;
  }

  @Override
  @PostConstruct
  public void loadData() throws IOException {
    long start = System.currentTimeMillis();
    root = assemble();
    log.info("Assembled wiki data from {} collections in {} ms", COLLECTIONS.size(),
        System.currentTimeMillis() - start);
  }

  @Override
  public JsonNode getRoot() {
    return root;
  }

  public boolean isValidCollection(String collection) {
    return VALID_COLLECTIONS.contains(collection);
  }

  @Override
  public List<JsonNode> list(String collection) {
    List<JsonNode> result = new ArrayList<>();
    JsonNode array = root.path(collection);
    if (array.isArray()) {
      for (JsonNode node : array) {
        result.add(node);
      }
    }
    return result;
  }

  @Override
  public JsonNode findBySlug(String collection, String slug) {
    JsonNode array = root.path(collection);
    if (!array.isArray()) {
      return null;
    }
    for (JsonNode node : array) {
      if (slug.equals(node.path("slug").asText(null))) {
        return node;
      }
    }
    return null;
  }

  @Override
  public JsonNode findById(String collection, String id) {
    JsonNode array = root.path(collection);
    if (!array.isArray()) {
      return null;
    }
    for (JsonNode node : array) {
      if (id.equals(node.path("id").asText(null))) {
        return node;
      }
    }
    return null;
  }

  @Override
  public List<String> collectionNames() {
    return new ArrayList<>(VALID_COLLECTIONS);
  }

  @Override
  public Map<String, Integer> stats() {
    Map<String, Integer> stats = new java.util.LinkedHashMap<>();
    for (String key : VALID_COLLECTIONS) {
      stats.put(key, root.path(key).size());
    }
    stats.put("pages", root.path("pages").size());
    stats.put("searchIndex", root.path("searchIndex").size());
    return stats;
  }

  @Override
  public JsonNode searchIndex() {
    return root.path("searchIndex");
  }

  @Override
  public JsonNode skillOwners(String skillId) {
    ObjectNode result = objectMapper.createObjectNode();
    ArrayNode crews = result.putArray("crews");
    for (JsonNode c : root.path("crews")) {
      if (containsSkill(c, skillId)) {
        crews.add(slim(c));
      }
    }
    ArrayNode classes = result.putArray("classes");
    for (JsonNode c : root.path("classes")) {
      if (containsSkill(c, skillId)) {
        classes.add(slim(c));
      }
    }
    return result;
  }

  private static boolean containsSkill(JsonNode node, String skillId) {
    JsonNode skills = node.path("skills");
    if (!skills.isArray()) {
      return false;
    }
    for (JsonNode s : skills) {
      String id = s.isTextual() ? s.asText() : s.path("id").asText(null);
      if (skillId.equals(id)) {
        return true;
      }
    }
    return false;
  }

  private static JsonNode slim(JsonNode node) {
    // 字段量很小，直接深拷贝；后续可改为只保留 id/slug/name/image 等摘要字段
    return node.deepCopy();
  }

  // -----------------------------------------------------------------
  // 组装
  // -----------------------------------------------------------------

  private JsonNode assemble() throws IOException {
    ObjectNode data = objectMapper.createObjectNode();

    ObjectNode meta = data.putObject("meta");
    meta.put("version", "1.0.0");
    meta.put("generatedAt", Instant.now().toString());

    for (String collection : COLLECTIONS) {
      ArrayNode arr = data.withArray(toCamel(collection));
      Resource[] files = resolver.getResources("classpath:data/yaml/" + collection + "/*.{yaml,yml}");
      for (Resource res : files) {
        String name = res.getFilename();
        if (name == null || !(name.endsWith(".yaml") || name.endsWith(".yml"))) {
          continue;
        }
        JsonNode node = readYaml(res);
        if (node != null && node.isObject()) {
          arr.add(node);
        } else {
          log.warn("Skipping non-object YAML: {}", res.getFilename());
        }
      }
    }

    ArrayNode pages = data.withArray("pages");
    JsonNode indexData = readYaml(resolver.getResource("classpath:data/yaml/index.yaml"));
    if (indexData != null) {
      JsonNode indexPages = indexData.path("pages");
      if (indexPages.isArray()) {
        for (JsonNode p : indexPages) {
          if (!p.isObject()) {
            continue;
          }
          ObjectNode page = ((ObjectNode) p).deepCopy();
          String md = page.path("markdown").asText(null);
          if (md != null) {
            page.put("content", readText(resolver.getResource("classpath:data/" + md)));
          }
          pages.add(page);
        }
      }
    }

    enrichRandomAffixOccurrences(data);
    buildSearchIndex(data, data.putArray("searchIndex"));

    return data;
  }

  private JsonNode readYaml(Resource res) {
    try (InputStream in = res.getInputStream()) {
      return yamlMapper.readTree(in);
    } catch (IOException e) {
      log.warn("Failed to read YAML {}: {}", res.getFilename(), e.getMessage());
      return null;
    }
  }

  private String readText(Resource res) {
    try (InputStream in = res.getInputStream()) {
      return new String(in.readAllBytes(), StandardCharsets.UTF_8);
    } catch (IOException e) {
      log.warn("Failed to read text {}: {}", res.getFilename(), e.getMessage());
      return "";
    }
  }

  private void enrichRandomAffixOccurrences(ObjectNode data) {
    java.util.Map<String, JsonNode> affixMap = new java.util.HashMap<>();
    for (JsonNode affix : data.path("randomAffixes")) {
      String id = affix.path("id").asText(null);
      if (id != null) {
        affixMap.put(id, affix);
      }
    }
    for (JsonNode eq : data.path("equipment")) {
      JsonNode ids = eq.path("randomAffixIds");
      if (!ids.isArray()) {
        continue;
      }
      for (JsonNode idNode : ids) {
        JsonNode affix = affixMap.get(idNode.asText());
        if (affix == null || !affix.isObject()) {
          continue;
        }
        ObjectNode affixObj = (ObjectNode) affix;
        ArrayNode occurrences = (ArrayNode) affixObj.get("occurrences");
        if (occurrences == null) {
          occurrences = affixObj.putArray("occurrences");
        }
        ObjectNode occ = occurrences.addObject();
        occ.put("equipmentId", eq.path("id").asText(null));
        occ.put("equipmentSlug", eq.path("slug").asText(null));
        occ.put("equipmentName", eq.path("name").asText(null));
        occ.put("level", eq.path("enhance").asInt(1));
      }
    }
  }

  private void buildSearchIndex(ObjectNode data, ArrayNode index) {
    forEach(data.path("crews"), c -> addEntry(index, c, "船员", "/crews/" + text(c, "slug"),
        List.of(), List.of(norm(c.path("role")), norm(c.path("element")))));
    forEach(data.path("ships"), s -> addEntry(index, s, "船只", "/ships/" + text(s, "slug"),
        List.of(), List.of()));
    forEach(data.path("classes"), cl -> addEntry(index, cl, "职业", "/classes/" + text(cl, "slug"),
        List.of(), List.of(norm(cl.path("role")), norm(cl.path("type")))));
    forEach(data.path("skills"), sk -> addEntry(index, sk, "技能", "/skills/" + text(sk, "slug"),
        nodeList(sk.path("tags")), List.of(norm(sk.path("class")), norm(sk.path("type")))));
    forEach(data.path("dice"), d -> addEntry(index, d, "骰子", "/dice/" + text(d, "slug"),
        List.of(norm(d.path("type"))), List.of()));
    forEach(data.path("songs"), s -> addEntry(index, s, "船歌", "/songs/" + text(s, "slug"),
        List.of(), List.of()));
    forEach(data.path("equipment"), e -> addEntry(index, e, "行装", "/equipment/" + text(e, "slug"),
        List.of(norm(e.path("slot")), norm(e.path("rarity"))), List.of()));
    forEach(data.path("randomAffixes"), a -> addEntry(index, a, "随机词条", "/random-affixes/" + text(a, "slug"),
        List.of(), List.of(norm(a.path("effect")))));
    forEach(data.path("items"), i -> addEntry(index, i, "物品", "/items/" + text(i, "slug"),
        List.of(norm(i.path("type")), norm(i.path("rarity"))), List.of()));
    forEach(data.path("quests"), q -> addEntry(index, q, "任务", "/quests/" + text(q, "slug"),
        List.of(norm(q.path("category"))), List.of()));
    forEach(data.path("locations"), l -> addEntry(index, l, "地点", "/locations/" + text(l, "slug"),
        List.of(norm(l.path("type"))), List.of()));

    forEach(data.path("glossary"), g -> {
      ObjectNode entry = index.addObject();
      entry.set("id", g.path("id"));
      entry.set("title", norm(g.path("term")));
      entry.put("type", "术语");
      entry.put("route", "/glossary#" + text(g, "id"));
      ArrayNode tags = entry.putArray("tags");
      JsonNode related = g.path("related");
      if (related.isArray()) {
        for (JsonNode r : related) {
          tags.add(norm(r));
        }
      }
      entry.putArray("keywords");
    });

    forEach(data.path("symptoms"), s -> addEntry(index, s, "症状", "/symptoms/" + text(s, "slug"),
        List.of(norm(s.path("severity")), norm(s.path("alignment"))), List.of()));
    forEach(data.path("shadows"), s -> addEntry(index, s, "往日之影", "/shadows/" + text(s, "slug"),
        List.of(norm(s.path("rarity"))), List.of()));

    forEach(data.path("guardians"), g -> {
      List<JsonNode> extraTags = new ArrayList<>();
      extraTags.add(norm(g.path("category")));
      if (!g.path("set").isMissingNode() && !g.path("set").isNull()) {
        extraTags.add(norm(g.path("set")));
      }
      List<JsonNode> keywords = new ArrayList<>();
      JsonNode tags = g.path("tags");
      if (tags.isArray()) {
        for (JsonNode t : tags) {
          keywords.add(norm(t.path("name")));
        }
      }
      addEntry(index, g, "守护", "/figurehead-prayer", extraTags, keywords);
    });

    forEach(data.path("shipTags"), t -> addEntry(index, t, "船只标签", "/figurehead-prayer",
        List.of(), List.of(norm(t.path("name")))));

    forEach(data.path("recruitmentPools"), p -> {
      ObjectNode entry = index.addObject();
      entry.set("id", p.path("id"));
      entry.set("title", norm(p.path("name")));
      entry.put("type", "招募池");
      entry.put("route", "/recruitment?pool=" + text(p, "slug"));
      ArrayNode tags = entry.putArray("tags");
      tags.add(norm(p.path("type")));
      tags.add(norm(p.path("currency")));
      entry.putArray("keywords");
    });

    forEach(data.path("pages"), p -> {
      ObjectNode entry = index.addObject();
      entry.set("id", p.path("id"));
      entry.set("title", norm(p.path("title")));
      entry.put("type", "指南");
      entry.put("route", text(p, "route"));
      entry.putArray("tags");
      entry.putArray("keywords");
    });
  }

  private void addEntry(ArrayNode index, JsonNode item, String type, String route,
                        List<JsonNode> extraTags, List<JsonNode> extraKeywords) {
    ObjectNode entry = index.addObject();
    entry.set("id", item.path("id"));
    entry.set("title", firstNonNull(item, "name", "title", "term"));
    entry.put("type", type);
    entry.put("route", route);

    ArrayNode tags = entry.putArray("tags");
    JsonNode itemTags = item.path("tags");
    if (itemTags.isArray()) {
      for (JsonNode t : itemTags) {
        tags.add(tagText(t));
      }
    }
    for (JsonNode t : extraTags) {
      tags.add(tagText(t));
    }

    ArrayNode keywords = entry.putArray("keywords");
    for (JsonNode k : extraKeywords) {
      keywords.add(norm(k));
    }
  }

  // -----------------------------------------------------------------
  // 小工具
  // -----------------------------------------------------------------

  private interface NodeConsumer {
    void accept(JsonNode node);
  }

  private static void forEach(JsonNode array, NodeConsumer consumer) {
    if (array != null && array.isArray()) {
      for (JsonNode node : array) {
        consumer.accept(node);
      }
    }
  }

  private static String text(JsonNode node, String field) {
    return node.path(field).asText(null);
  }

  private static JsonNode firstNonNull(JsonNode item, String... fields) {
    for (String field : fields) {
      JsonNode v = item.path(field);
      if (!v.isMissingNode() && !v.isNull()) {
        return v;
      }
    }
    return NullNode.getInstance();
  }

  private static JsonNode norm(JsonNode n) {
    return (n == null || n.isMissingNode() || n.isNull()) ? NullNode.getInstance() : n;
  }

  private static JsonNode tagText(JsonNode tag) {
    if (tag == null || tag.isMissingNode() || tag.isNull()) {
      return NullNode.getInstance();
    }
    if (tag.isTextual()) {
      return tag;
    }
    if (tag.isObject()) {
      JsonNode name = tag.path("name");
      if (!name.isMissingNode() && !name.isNull()) {
        return name;
      }
    }
    return NullNode.getInstance();
  }

  private static List<JsonNode> nodeList(JsonNode array) {
    List<JsonNode> list = new ArrayList<>();
    if (array != null && array.isArray()) {
      for (JsonNode n : array) {
        list.add(n);
      }
    }
    return list;
  }

  public static String toCamel(String collection) {
    StringBuilder sb = new StringBuilder();
    boolean upper = false;
    for (char ch : collection.toCharArray()) {
      if (ch == '-') {
        upper = true;
        continue;
      }
      sb.append(upper ? Character.toUpperCase(ch) : ch);
      upper = false;
    }
    return sb.toString();
  }
}
