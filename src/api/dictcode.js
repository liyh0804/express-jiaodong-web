
import request from '@/utils/request'

// 根据code获取枚举类型
export function getDictByCode(code) {
  return request.get(`/firefighting-system/common/getDictByCode?code=${code}`)
}
