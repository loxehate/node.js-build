import { service } from './service'

import { config } from './config'

import { decryptAES } from '@/components/LowDesign/src/utils/aes'

const { default_headers } = config

const request = (option: any) => {
  const { url, method, params, data, headersType, responseType, headers, moerData, ...config } = option
  return service({
    url: url,
    method,
    params,
    data,
    ...config,
    responseType: responseType,
    headers: {
      'Content-Type': headersType || default_headers,
      ...(headers || {})
    },
    ...(moerData || {}),
  })
}
export default {
  get: async <T = any>(option: any) => {
    let res = await request({ method: 'GET', ...option })
    if (typeof res == 'string') {
      try {
        res = JSON.parse(decryptAES(res))
      } catch (error) { }
    }
    return res.data as unknown as T
  },
  post: async <T = any>(option: any) => {
    const res = await request({ method: 'POST', ...option })
    return res.data as unknown as T
  },
  postOriginal: async (option: any) => {
    const res = await request({ method: 'POST', ...option })
    return res
  },
  delete: async <T = any>(option: any) => {
    const res = await request({ method: 'DELETE', ...option })
    return res.data as unknown as T
  },
  put: async <T = any>(option: any) => {
    const res = await request({ method: 'PUT', ...option })
    return res.data as unknown as T
  },
  download: async <T = any>(option: any) => {
    const res = await request({ method: 'GET', responseType: 'blob', ...option })
    return res as unknown as Promise<T>
  },
  upload: async <T = any>(option: any) => {
    option.headersType = 'multipart/form-data'
    const res = await request({ method: 'POST', ...option })
    return res as unknown as Promise<T>
  }
}
