import request from '@/utils/request'

export function uploadFile(params) {
  return request.post('/firefighting-system/upload/uploadFile', params, { contentType: false, processData: false, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
}
export function uploadMulFile(params) {
  return request.post('/firefighting-system/upload/uploadMultiFile', params, { contentType: false, processData: false, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
}
