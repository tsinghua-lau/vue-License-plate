import axios from 'axios'
// import { getCookie } from '../../utils/auth'

const service = axios.create({
    // 公共接口
    baseURL: process.env.NODE_ENV === "production" ?'https://XXXXXX/':'/api',
    // 超时时间
    timeout: 10 * 1000,
})
service.interceptors.request.use(
    config => {
        config.data = JSON.stringify(config.data)
        // console.log('=========',config.data)
        config.headers = {
            // 'Content-Type': 'application/json', //配置请求头
            // 'Access-Control-Allow-Origin': '*',
            // 'Accept':'*/*'

            'Content-Type': 'application/json;charset=utf-8', //配置请求头
            'Access-Control-Allow-Origin': '*',
            token: 1,
            unit: 1,
            busType: 1,
            processId: 1,

//             'server' :'uvicorn',
// 'Content-Type':'application/json',
// 'content-encoding' :'gzip',
// 'vary' :'Accept-Encoding',
// 'transfer-encoding':'chunked',
            // token: 1,
            // unit: 1,
            // busType: 1,
            // processId: 1,

        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    response => {
        if(response?.data?.type=='application/vnd.ms-excel'){
            return response
        }
        if (response.data.success) {
            return response
        } else {
            if(response.data.code==='-1' || response.data.code===null ){
                // Message.error({
                //     message: response.data.msg,
                //     duration:  3000,
                // })
            }
            else  if(response.data.code==='500'){
                // Message.error({
                //     message: response.data.msg,
                //     duration:  3000,
                // })
            }
            else  if(response.data.code.length>'20'){
                // Message.error({
                //     message: response.data.msg,
                //     duration:  3000,
                // })
            }
            else{
                // Message.error({
                //     message: response.data.code,
                //     duration:  3000,
                // })
            }

            return response
        }
    },
    error => {
        if (error || error.response) {
            // 1.公共错误处理
            // 2.根据响应码具体处理
        } else {
            if (JSON.stringify(error).includes('timeout')) {
                error.message('服务器响应超时，请刷新当前页')
            }
            error.message('连接服务器失败')
        }
        return Promise.resolve(error.response)
    }
)
export default service
