package com.sor.service;

import java.util.List;

/**
 * 实体 Service 通用接口。
 */
public interface BaseEntityService<T> {

  List<T> list();

  T findBySlug(String slug);

  T findById(String id);
}
