package com.sor.service;

import com.sor.model.Page;

import java.util.List;

/**
 * Markdown 页面 Service 接口。
 */
public interface PageService {

  List<Page> listAll();

  Page findById(String id);
}
