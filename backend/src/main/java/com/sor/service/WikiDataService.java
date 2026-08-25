package com.sor.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
public class WikiDataService {

  private final ObjectMapper objectMapper = new ObjectMapper();
  private JsonNode root;

  @PostConstruct
  public void loadData() throws IOException {
    File file = ResourceUtils.getFile("classpath:data/generated.json");
    root = objectMapper.readTree(file);
  }

  public JsonNode getRoot() {
    return root;
  }

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

  public List<String> collectionNames() {
    List<String> names = new ArrayList<>();
    Iterator<String> it = root.fieldNames();
    while (it.hasNext()) {
      names.add(it.next());
    }
    return names;
  }
}
