<template>
  <div class="gis-selector-kernel">
    <a-spin :spinning="state.loading">
      <div id="js-amap-container" class="gis-container">
        <div id="pickerBox">
          <span @click="onPickerInputEnter">
            <svg t="1627962232320" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                 p-id="2124" width="200" height="200">
              <path
                d="M990.752 938.056 733.816 681.12c55.76-69.712 89.096-158.128 89.096-254.328 0-225.024-182.416-407.456-407.456-407.456C190.432 19.336 8 201.768 8 426.792s182.432 407.456 407.456 407.456c96.208 0 184.624-33.344 254.328-89.112l256.936 256.936c8.84 8.84 20.424 13.264 32.008 13.264 11.592 0 23.176-4.424 32.024-13.264C1008.424 984.4 1008.424 955.728 990.752 938.056zM415.456 743.696c-175.024 0-316.904-141.88-316.904-316.904s141.88-316.904 316.904-316.904c175.032 0 316.904 141.88 316.904 316.904S590.488 743.696 415.456 743.696z"
                p-id="2125"></path>
            </svg>
          </span>
          <input id="pickerInput" v-model="state.pickerInputVal" @keyup.enter="onPickerInputEnter"
                 placeholder="请输入搜索关键字" autocomplete="off"/>
          <div id="poiInfo"></div>

        </div>
        <!--        <div class="info" v-show="state.buildInfo.show">-->
        <!--          <h4>当前建筑</h4>-->
        <!--          <div>id：<span id="map-zoom">{{ state.buildInfo.id }}</span></div>-->
        <!--          <div>当前坐标集合：<span id="map-center">-->
        <!--              <div v-for="(item,index) in state.buildInfo.coordinates" :key="index">-->
        <!--            {{ item }}-->
        <!--              </div></span></div>-->
        <!--        </div>-->
      </div>
    </a-spin>
  </div>
</template>

<script>

import { useStore } from 'vuex'
import { onBeforeUnmount, onMounted, reactive } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { message } from 'ant-design-vue'

export default {
  props: {
    address: {
      type: String,
      default: function () {
        return ''
      }
    },
    lnglat: {
      type: Array,
      default: function () {
        return []
      }
    },
    id: {
      type: String,
      default: function () {
        return ''
      }
    }
  },
  emits: ['selectedInfoCallBack'],
  setup(props, context) {
    const store = useStore()
    const state = reactive({
      loading: true,
      pickerInputVal: '',
      buildInfo: {
        show: false
      },
      selectedBuildInfo: {}
    })
    let map = null
    let loca = null
    let pl = null
    let geocoder = null

    const topColorSelected = '#f39580'
    const topColorMouseover = '#FD8165'
    const topColor = '#cfd2e5'
    const sideColor = '#6a6f7a'

    /***
     * 存一些对象的堆想
     */
    const mapService = {}
    /***
     * 高德地图key
     **/
    const mapKey = '6282d016097316be994ada4aa15e7a3c'
    /***
     * 中心店坐标
     **/
    const center = [120.447128, 36.389639]

    /****
     * 初始化地图
     */
    const initAMap = (AMap) => {
      /***
       * 地图初始化
       * 参数详见：https://lbs.amap.com/api/javascript-api/reference/map
       */
      map = new AMap.Map('js-amap-container', {
        /****
         * 是否开启地图热点和标注的hover效果。PC端默认是true，移动端默认是false
         */
        isHotspot: false,
        skyColor: 'rgba(158,227,244,0.59)',
        /***
         * 是否监控地图容器尺寸变化
         */
        resizeEnable: true,
        /****
         * 设置地图的显示样式
         */
        mapStyle: 'amap://styles/ba9b654dc84150b53f75670d111cd250',

        /***
         * 3d地图模式
         */
        viewMode: '3D',
        /***
         * 不显示楼块
         */
        showBuildingBlock: false,
        /***
         * 角度
         */
        pitch: 60,
        /***
         * 地图顺时针旋转角度
         */
        // rotation: 25,
        /***
         * 是否支持可以扩展最大缩放级别,和zooms属性配合使用
         * 设置为true的时候，zooms的最大级别在PC上可以扩大到20级，移动端还是高清19/非高清20
         */
        expandZoomRange: true,
        /***
         * 缩放级别范围
         */
        zooms: [3, 20],
        /***
         * 缩放级别
         */
        zoom: 15,
        /***
         * 中心点
         */
        center: center
      })

      geocoder = new AMap.Geocoder({
        /****
         * 范围，默认：500
         */
        radius: 1000
      })

      /***
       * 加载搜索框
       */
      AMapUI.loadUI(['misc/PoiPicker'], function (PoiPicker) {
        var poiPicker = new PoiPicker({
          input: 'pickerInput'
        })
        /****
         * 初始化poiPicker
         */
        poiPickerReady(poiPicker)
      })

      /****
       * 构造地点查询类
       */
      mapService.placeSearch = new AMap.PlaceSearch({
        pageSize: 1,
        pageIndex: 1,
        /*****
         * 是否强制限制在设置的城市内搜索
         */
        citylimit: false,
        /*****
         *  是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
         */
        autoFitView: true
      })
      /***
       * 加载geo楼体3d数据
       */
      loadGeoJson()

      if (window.location.href.indexOf('?') === -1) {
        map.on('mousemove', (e) => {
          var feat = pl.queryFeature(e.pixel.toArray())
          if (feat) {
            // text.show();
            // text.setText(feat.properties.g_id);
            // text.setPosition(e.lnglat);
            state.buildInfo = {
              id: String(feat.properties.id),
              coordinates: feat.coordinates[0],
              show: true
            }
            document.getElementById('js-amap-container').style.cursor = 'pointer'
            pl.setStyle({
              topColor: (index, feature) => {
                if (feature === feat) {
                  return topColorMouseover
                }
                if (String(feature.properties.id) === state.selectedBuildInfo.id) {
                  return topColorSelected
                }
                return topColor
              },
              sideColor: (index, feature) => {
                if (feature === feat) {
                  return topColorMouseover
                }
                if (String(feature.properties.id) === state.selectedBuildInfo.id) {
                  return topColorSelected
                }
                return sideColor
              },
              height: function (index, feature) {
                var v = feature.properties.height
                return v
              }
            })
          } else {
            if (state.selectedBuildInfo.id !== state.buildInfo.id) {
              pl.setStyle({
                topColor: (index, feature) => {
                  if (String(feature.properties.id) === state.selectedBuildInfo.id) {
                    return topColorSelected
                  }
                  return topColor
                },
                sideColor: (index, feature) => {
                  if (String(feature.properties.id) === state.selectedBuildInfo.id) {
                    return topColorSelected
                  }
                  return sideColor
                },
                height: function (index, feature) {
                  var v = feature.properties.height
                  return v
                }
              })
              state.buildInfo = state.selectedBuildInfo
            }
            document.getElementById('js-amap-container').style.cursor = 'default'
          }
        })
        map.on('click', (e) => {
          state.selectedBuildInfo = state.buildInfo
          var feat = pl.queryFeature(e.pixel.toArray())
          if (feat) {
            pl.setStyle({
              topColor: (index, feature) => {
                if (feature === feat) {
                  return topColorSelected
                }
                return topColor
              },
              sideColor: (index, feature) => {
                if (feature === feat) {
                  return topColorSelected
                }
                return sideColor
              },
              height: function (index, feature) {
                var v = feature.properties.height
                return v
              }
            })
            /***
             * 通过经纬度找具体地址
             */
            geocoder.getAddress(e.lnglat, function (status, result) {
              if (status === 'complete' && result.regeocode) {
                var address = result.regeocode.formattedAddress

                context.emit('selectedInfoCallBack', {
                  id: feat.properties.id,
                  lnglat: e.lnglat,
                  address: address
                })
              } else {
                message.warning('根据经纬度查询地址失败')
                context.emit('selectedInfoCallBack', {
                  id: feat.properties.id,
                  lnglat: e.lnglat,
                  address: null
                })
              }
            })
          } else {
            context.emit('selectedInfoCallBack', {
              id: null,
              lnglat: null,
              address: null
            })
          }
        })
      }
    }

    /***
     * 提示信息
     */
    const showInfo = (content, position) => {
      if (mapService.infoWindow) {
        mapService.infoWindow.close()
        mapService.infoWindow = null
      }
      mapService.infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -20)
      })
      mapService.infoWindow.setMap(map)

      mapService.infoWindow.setPosition(position)
      mapService.infoWindow.setContent(content)
      mapService.infoWindow.open(map, mapService.infoWindow.getPosition())
    }
    /***
     * 搜索框内选择回调
     */
    const poiPickerReady = (poiPicker) => {
      /**
       * 选取了某个POI
       */
      poiPicker.on('poiPicked', function (poiResult) {
        console.log('poiPicked')
        // var source = poiResult.source,
        const poi = poiResult.item
        const info = {
          // source: source,
          id: poi.id,
          name: poi.name,
          location: poi.location.toString(),
          address: poi.address
        }
        showInfo('POI信息: <pre>' + JSON.stringify(info, null, 2) + '</pre>', poi.location)
        state.pickerInputVal = poi.name
      })
    }

    /****
     * 加载地图插件
     */
    const loadAMap = () => {
      AMapLoader.load({
        key: mapKey,
        version: '2.0',
        plugins: ['Map3D', 'AMap.Geocoder', 'AMap.PlaceSearch'],
        AMapUI: {
          version: '1.1',
          plugins: []
        },
        Loca: {
          version: '2.0.0'
        }
      }).then((AMap) => {
        initAMap(AMap)
      }).catch(e => {
        console.log(e)
      })
    }

    /***
     * 加载geo楼体3d数据
     */
    const loadGeoJson = () => {
      loca = new Loca.Container({
        map
      })
      pl = new Loca.PolygonLayer({
        // loca,
        zIndex: 120,
        // opacity: 0.9,
        // cullface: 'none',
        shininess: 10,
        hasSide: true
      })
      // loca.ambLight = {
      //   intensity: 0.5,
      //   color: '#fff'
      // }
      // loca.dirLight = {
      //   intensity: 0.6,
      //   color: '#fff',
      //   target: [0, 0, 0],
      //   position: [0, -1, 1]
      // }
      // loca.pointLight = {
      //   color: 'rgb(100,100,100)',
      //   position: [120.24289, 30.341335, 20000],
      //   intensity: 3,
      //   // 距离表示从光源到光照强度为 0 的位置，0 就是光不会消失。
      //   distance: 50000
      // }
      console.log('gis/getAllGisGeoJSon')
      store.dispatch('gis/getAllGisGeoJSon').then((res) => {
        if (res && res.success) {
          const geo = new Loca.GeoJSONSource({
            data: res.result
          })

          pl.setSource(geo)
          loca.add(pl)

          if (props.id.replace(/(^s*)|(s*$)/g, '').length !== 0) {
            console.log(res.result)
            console.log(props.id)
            for (let i = 0; i < res.result.features.length; i++) {
              const item = res.result.features[i]
              if (item.properties.id.toString() === props.id) {
                map.setCenter(item.geometry.coordinates[0][0])
                state.selectedBuildInfo = {
                  id: String(item.properties.id),
                  coordinates: item.geometry.coordinates[0],
                  show: true
                }
                state.buildInfo = state.selectedBuildInfo
                context.emit('selectedInfoCallBack', {
                  id: state.selectedBuildInfo.id,
                  lnglat: props.lnglat ? props.lnglat : item.geometry.coordinates[0],
                  address: props.address ? props.address : ''
                })
              }
            }
          } else if (props.lnglat.length > 1) {
            map.setCenter(props.lnglat)
            // map.setCenter(center)
          } else if (props.address !== null && props.address !== '') {
            state.pickerInputVal = props.address
            onPickerInputEnter(false)
          }

          pl.setStyle({
            topColor: (index, feature) => {
              if (state.selectedBuildInfo && String(feature.properties.id) === state.selectedBuildInfo.id) {
                return topColorSelected
              }
              return topColor
            },
            sideColor: (index, feature) => {
              if (state.selectedBuildInfo && String(feature.properties.id) === state.selectedBuildInfo.id) {
                return topColorSelected
              }
              return sideColor
            },
            height: function (index, feature) {
              var v = feature.properties.height
              return v
            }
          })
          state.loading = false
        }
      })
    }

    /****
     * 搜索回车事件
     */
    const onPickerInputEnter = (isShowInfo = true) => {
      if (mapService.infoWindow) {
        mapService.infoWindow.close()
        mapService.infoWindow = null
      }
      console.log('onPickerInputEnter')
      mapService.placeSearch.search(state.pickerInputVal, function (status, result) {
        console.log(status)
        if (!mapService.infoWindow) {
          if (status !== 'complete' || result.poiList.pois.length === 0) {
            message.warning('结果未找到')
            return
          }
          const poi = result.poiList.pois[0]
          const info = {
            // source: source,
            id: poi.id,
            name: poi.name,
            location: poi.location.toString(),
            address: poi.address
          }
          if (isShowInfo) {
            showInfo('POI信息: <pre>' + JSON.stringify(info, null, 2) + '</pre>', poi.location)
          }
          map.setCenter(poi.location)
        }
      })
    }

    onMounted(() => {
      loadAMap()
    })

    onBeforeUnmount(() => {
      map && map.destroy()
      loca && loca.destroy()
    })
    return {
      state,
      onPickerInputEnter
    }
  }

}
</script>
<style scoped>
.gis-selector-kernel {
  width: 100%;
  height: 100%;
}

:deep().ant-spin-nested-loading,
:deep().ant-spin-container {
  height: 100%;
}

:deep().ant-spin-nested-loading > div > .ant-spin {
  max-height: none;
}

.gis-container {
  width: 100%;
  height: 600px;
  /*position: absolute;*/
}

:deep().gis-container .amap-logo,
:deep().gis-container .amap-copyright {
  display: none !important;
}

#pickerBox {
  position: relative;
  z-index: 9;
  top: 20px;
  left: 20px;
  width: 280px;
}

#pickerBox span {
  position: absolute;
  right: 0px;
  top: 0px;
  width: 34px;
  padding: 0px 8px;
  height: 34px;
  fill: rgba(0, 0, 0, 0.25);
  cursor: pointer;
  display: block;
}

#pickerBox span svg {
  width: 100%;
  height: 100%;
}

#pickerInput {
  width: 100%;
  padding: 5px 25px 5px 12px;
  outline: none;
  border: 1px solid rgba(0, 0, 0, 0.15);
}

#poiInfo {
  background: #fff;
}

.amap_lib_placeSearch .poibox.highlight {
  background-color: #CAE1FF;
}

.amap_lib_placeSearch .poi-more {
  display: none !important;
}

.info {
  padding: 8px;
  margin-bottom: 5px;
  border-radius: 3px;
  position: absolute;
  top: 20px;
  background-color: white;
  width: auto;
  min-width: 200px;
  border-width: 0;
  right: 20px;
  box-shadow: 0 2px 6px 0 rgb(114 124 245 / 50%);
  z-index: 9;
  font-size: 13px;
}

.test-btns {
  position: absolute;
  z-index: 9;
  left: 320px;
}

.test-btns span {
  width: 20px;
  height: 20px;
  display: inline-block;
  cursor: pointer;
}

.test-btns span svg {
  width: 100%;
  height: 100%;
  fill: lightskyblue;
}
</style>
