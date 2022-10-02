import request from '@/utils/request'

export function getFloorList(params) {
  return request.get('/firefighting-system/bizArea/getFloorList', { params })
}

export function getQueryCamerasByFloor(params) {
  return request.get('/firefighting-system/camera/getCameraListByLocationId', { params })
}

// 获取所有楼层
// firefighting/buildingFloor/queryVideoGroupUnderFloor
export function queryVideoGroupUnderFloor(params) {
  return request.get('/firefighting-system/camera/getAllCameraListByBuild', { params })
}

// 获取dange楼层
// firefighting/buildingFloor/queryVideoGroupUnderFloor
export function getCameraListByLocationId(params) {
  return request.get('/firefighting-system/camera/getCameraListByLocationId', { params })
}
