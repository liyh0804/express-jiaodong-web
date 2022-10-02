import request from '@/utils/request'

// 获取所有gis 3d 楼体
export function getAllGisGeoJSon(params) {
  return request.get('/firefighting-system/geometry/getAll', { params }).then(res => res)
}
