package com.sor.api;

/**
 * 统一接口响应包装：{ code, data, message }
 *
 * code=0 成功；404 目标不存在；400 非法请求；500 后端异常。
 */
public record ApiResponse<T>(int code, T data, String message) {

  public static <T> ApiResponse<T> ok(T data) {
    return new ApiResponse<>(0, data, "ok");
  }

  public static <T> ApiResponse<T> error(int code, String message) {
    return new ApiResponse<>(code, null, message);
  }
}
