import request from '@/utils/request'
// 获取今日故障相关统计数据
export function getBoxMessageCount() {
  return request.get('/firefighting-system/common/getBoxMessageCount').then(res => res)
}
