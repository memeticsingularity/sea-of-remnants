package com.sor.service;

import com.sor.model.SearchIndexEntry;

import java.util.List;

/**
 * 搜索索引 Service 接口。
 */
public interface SearchService {

  List<SearchIndexEntry> listAll();
}
