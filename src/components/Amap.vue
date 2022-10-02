<template>
  <div id="container"></div>
</template>
<script lang="ts">
// import Vue from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'

export default {
  // data () {}
  created () {
    let map = null
    AMapLoader.load({
      key: '06916caa9dbbc3c9dfefc61e6e414124', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '1.4.15', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      // viewMode: '3D',
      plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      AMapUI: { // 是否加载 AMapUI，缺省不加载
        version: '1.1', // AMapUI 缺省 1.1
        plugins: [] // 需要加载的 AMapUI ui插件
      },
      Loca: { // 是否加载 Loca， 缺省不加载
        version: '1.3.2' // Loca 版本，缺省 1.3.2
      }
    }).then((AMap) => {
      map = new AMap.Map('container', {
        zoom: 11,
        center: [116.397428, 39.90923],
        layers: [
          // new AMap.TileLayer.Satellite(),
          new AMap.TileLayer.RoadNet()
        ],
        viewMode: '3D',
        pitch: 75
      })
      //
      // const trafficLayer = new AMap.TileLayer.Traffic({
      //   zIndex: 10
      // })
      // map.add(trafficLayer)
      // marker
      // var infoWindow = new AMap.InfoWindow({ // 创建信息窗体
      //   isCustom: true, // 使用自定义窗体
      //   content: '<div>信息窗体<div>', // 信息窗体的内容可以是任意html片段
      //   offset: new AMap.Pixel(16, -45)
      // })
      // var onMarkerClick = function (e:any) {
      //   alert(111)
      //   // infoWindow.open(map, e.target.getPosition()) // 打开信息窗体
      // }
      // var marker = new AMap.Marker({
      //   position: [116.481181, 39.989792]
      // })
      // map.add(marker)
      // marker.on('click', onMarkerClick)
      // var marker = new AMap.Marker({
      //   position: [116.39, 39.9]
      // })
      // map.add(marker)

      // var lineArr = [
      //   [116.368904, 39.913423],
      //   [116.382122, 39.901176],
      //   [116.387271, 39.912501],
      //   [116.398258, 39.904600]
      // ]
      // var polyline = new AMap.Polyline({
      //   path: lineArr, // 设置线覆盖物路径
      //   strokeColor: '#3366FF', // 线颜色
      //   strokeWeight: 5, // 线宽
      //   strokeStyle: 'solid' // 线样式
      // })
      // map.add(polyline)
      // var toolbar = null
      // var driving = null
      // AMap.plugin(['AMap.ToolBar', 'AMap.Driving'], function () {
      //   toolbar = new AMap.ToolBar()
      //   driving = new AMap.Driving()
      //   driving.search()
      // })
      // map.addControl(toolbar)

      // const marker = new AMap.Marker({
      //   position: new AMap.LngLat(116.39, 39.9),
      //   title: '北京'
      // })
      var marker = new AMap.Marker({
        position: new AMap.LngLat(116.39, 39.9),
        offset: new AMap.Pixel(-10, -10),
        icon: '//vdata.amap.com/icons/b18/1/2.png', // 添加 Icon 图标 URL
        title: '北京'
      })
      map.add(marker)
      // map.remove(marker)
    }).catch(e => {
      console.log(e)
    })
  }
}
</script>
<style lang="less" scoped>
  #container {
    width: 100vw;
    height: 100vh;
  }
</style>
