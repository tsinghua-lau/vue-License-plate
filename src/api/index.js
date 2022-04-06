import request from './request'
import http from './http.js'

const searchApi = function(url,ps) {
    return http.post(url, ps)
}
export  {
    searchApi
}