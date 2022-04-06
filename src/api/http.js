import request from './request.js'

const http = {
  /**
     * methods: 请求
     * @param url 请求地址
     * @param params 请求参数
     */
  get (url, params) {
    const config = {
      method: 'get',
      url: url
    }
    if (params) config.params = params
    return request(config)
  },
  post (url, params) {
    const config = {
      method: 'post',
      url: url

    }
    if (params) config.data = params
    return request(config)
  },
  put (url, params) {
    const config = {
      method: 'put',
      url: url
    }
    if (params) config.params = params
    return request(config)
  },
  delete (url, params) {
    const config = {
      method: 'delete',
      url: url
    }
    if (params) config.params = params
    return request(config)
  },
  download (url, params) {
    const config = {
      method: 'post',
      url: url,
      // headers: {
      //     'Content-Type': 'application/json;charset=UTF-8',
      // },
      responseType: 'blob' // 二进制流
    }
    if (params) config.data = params
    return request(config)
  }
}
// 导出
export default http
