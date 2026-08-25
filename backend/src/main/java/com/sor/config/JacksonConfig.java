package com.sor.config;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.yaml.YAMLMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * Jackson 全局配置。
 *
 * - 默认不序列化 null 字段，避免 POJO 未赋值字段污染 JSON。
 * - 注入 Spring 容器，供 WikiDataRepository 与各领域 Service 统一使用。
 */
@Configuration
public class JacksonConfig {

  @Bean
  @Primary
  public ObjectMapper objectMapper() {
    ObjectMapper mapper = new ObjectMapper();
    mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
    mapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
    return mapper;
  }

  @Bean
  public YAMLMapper yamlMapper() {
    return new YAMLMapper();
  }
}
