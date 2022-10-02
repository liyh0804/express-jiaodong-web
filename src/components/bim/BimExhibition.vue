<template>
  <div class="gh-modal-dialog-header" v-if="state.propsFloorArea!==null">设备定位</div>
  <div ref="bimExhibitionDiv" class="bim-exhibition-div" :style='{position:state.showScreenExitOut?"fixed":"relative"}'
       @mouseup="mouseup">
    <a-spin :spinning="state.loading" class="bimexhibitionspin">
    </a-spin>
    <div id="js-bim-exhibition-left-div" class="bim-exhibition-left-div" ref="bimExhibitionLeftDiv">
      <div class="bim-left-header">
        <div class="bim-title w2">楼宇BIM展示</div>
        <FullscreenOutlined class="bimexhibition-screen" @click="fullScreenClick" v-show="state.showScreenOut"/>
        <FullscreenExitOutlined class="bimexhibition-screen" @click="fullScreenClick" v-show="state.showScreenExitOut"/>
        <div class="bim-auto-search-div clearfix">
          <div class="box">
            <a-auto-complete id="js-bimsearch"
                             v-model:value="bimSearch"
                             @select="onSelect"
                             @search="onSearch"
                             @focus="onFocus"
                             @blur="onBlur"
                             dropdownClassName="bimsearch-dropdown-class"
            >
              <template #dataSource>
                <a-select-option v-for="item in bimSearchResult.list" :key="item.areaCode" :key_obj="item"
                                 :data-areaid="item.areaId"
                                 :value="item.companyName">
                  <div :title="item.companyName" class="bim-search-item clearfix"><span>{{ item.companyName }}</span>
                    <dd :class="{'disabled':(item.areaCode!=='15')}">{{ item.areaCode }}楼</dd>
                  </div>
                </a-select-option>
              </template>
            </a-auto-complete>
            <span v-show="state.showPlaceHolder">请输入单位名称</span>
          </div>
        </div>
      </div>
      <div id="js-floors-tap-box" ref="floorsTapBox" style="display: none">
        <div class="floors-tap-item" @mousedown="floorsTapPageUp()">
          <UpOutlined/>
        </div>
        <div class="floors-tap-show" ref="floorsTapShow">
          <div class="floors-tap-absolute" ref="floorsTapAbsolute" style="top:-1.2rem;">
            <div @click="toF(item)" class="floors-tap-item" v-for='item in floors.list'
                 :key="item.id"
                 :data-id="item.id"
                 :class="{'floors-tap-item-selected':(state.selectedFloor.id==item.id),'floors-tap-item-selected-disabled':(item.areaCode!=='15')}">
              F{{ item.areaCode }}
            </div>
          </div>
        </div>

        <div class="floors-tap-item" :class="{'floors-tap-item-selected':(state.selectedFloor.id===-1)}"
             @click="toAllF">全景
        </div>
        <div class="floors-tap-item" @mousedown="floorsTapPageDown()">
          <DownOutlined/>
        </div>
      </div>
      <canvas id="js-bim-exhibition-canvas" ref="bimExhibitionCanvas"></canvas>
    </div>
    <div class="bim-exhibition-right-div" ref="bimExhibitionRightDiv">

      <div class="bim-exhibition-right-top-div">
        <div class="bim-left-header" style="z-index: 8">
          <div class="bim-title w2">楼层平面展示</div>
        </div>
        <a-spin :spinning="state.imgLoading">
        </a-spin>
        <a-image :style="{maxHeight:state.imgHeight,opacity:state.imgLoading?0:1}"
                 :preview="false"
                 :src="state.imgSrc"
                 fallback="data:image/png;base64,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"
        />
        <div class="bim-2d-box" v-show="!state.imgLoading">
          <div>
            <img v-for="item in state.devicesImg" :style='{left:item.x,top:item.y}' :key="item.id" :title="item.title"
                 :data-id="item.id"
                 @click="showDeviceDetails(item.id)"
                 :src="item.src"/>

          </div>
        </div>
      </div>
      <div class="bim-exhibition-right-bottom-div">
        <div class="bim-left-header" style="z-index: 8">
          <div class="bim-title w2">楼层3D展示</div>
        </div>
        <a-spin :spinning="state.floorLoading">
        </a-spin>
        <canvas id="js-bim-exhibition-floor-canvas" v-show="!state.floorLoading"></canvas>
      </div>
    </div>

    <a-modal dialogClass="gh-modal-dialog"
             wrapClassName="gh-modal-dialog-wrap"
             @destroyOnClose="true"
             :title="null"
             width="960px"
             :visible="state.deviceInfoVisable"
             @cancel="state.deviceInfoVisable = false"
             :destroyOnClose="true"
             :footer="null"
             :maskClosable="false"
             :keyboard="false"
    >
      <DeviceDetails :deviceId="state.deviceId"/>
    </a-modal>

  </div>
</template>

<script>

import { reactive, watch, ref, onMounted, computed } from 'vue'
import { FullscreenOutlined, FullscreenExitOutlined, UpOutlined, DownOutlined } from '@ant-design/icons-vue'
import { AutoComplete } from 'ant-design-vue'
import DeviceDetails from '@/components/device/DeviceDetails.vue'
import { getRem } from '@/utils/tool'
import { useStore } from 'vuex'

export default {
  name: 'bimExhibition',
  props: {
    width: {
      type: Number,
      default: function () {
        return null
      }
    },
    height: {
      type: Number,
      default: function () {
        return null
      }
    },
    floorArea: {
      type: Object,
      default: function () {
        return null
      }
    }
  },
  // watch:{
  //   width:{
  //     handler:function(nv,ov){
  //       this.setSize();
  //     },
  //     immediate:false
  //   },
  //   height:{
  //     handler:function(nv,ov){
  //       this.setSize();
  //     },
  //     immediate:false
  //   },
  // },
  // computed:{
  //     getWidth:function (){
  //       return this.width==null?window.innerWidth:this.width;
  //     },
  //     getHeight:function(){
  //       return this.height==null?window.innerHeight:this.height;
  //     }
  // },
  components: {
    FullscreenOutlined,
    FullscreenExitOutlined,
    UpOutlined,
    DownOutlined,
    'a-auto-complete': AutoComplete,
    DeviceDetails
  },
  emits: ['showFloor'],
  setup(props, context) {
    const builtAreaId = 7

    const store = useStore()
    const buildUrl = process.env.BASE_URL + 'unity'
    const state = reactive({
      unityInstance: null,
      loading: true,
      isShowFloor: false,
      selectedFloor: {
        id: -1
      },
      imgHeight: 0,
      imgSrc: '',
      imgLoading: true,
      floorLoading: true,
      showScreenOut: false,
      showScreenExitOut: false,
      showPlaceHolder: true,
      devicesImg: [],
      deviceInfoVisable: false,
      propsFloorArea: null
    })

    const bimExhibitionCanvas = ref()
    const bimExhibitionLeftDiv = ref()
    const bimExhibitionRightDiv = ref()
    const bimExhibitionDiv = ref()
    const floorsTapBox = ref()
    const floorsTapAbsolute = ref()
    const floorsTapShow = ref()
    /****
     *消火栓   2
     *感烟探测器   3
     *电气火灾设备  2
     * 喷淋末端   1
     * 通风口    1
     * 液位     1
     * 防火门    1
     * 应急通道 1
     */
    let devices = [
      {
        id: 'A_F15_01',
        name: '消火栓01',
        type: '消火栓',
        pos: '0.1x0.1',
        rot: 0,
        state: '#888888',
        floor: 0
      },
      {
        id: 'A_F15_02',
        name: '消火栓02',
        type: '消火栓',
        pos: '0.3x0.3',
        rot: 0,
        state: '#58EDB6',
        floor: 0
      },
      {
        id: 'A_F15_03',
        name: '感烟探测器01',
        type: '感烟探测器',
        pos: '0.1x0.5',
        rot: 0,
        state: '#58EDB6',
        floor: 0
      },
      {
        id: 'A_F15_04',
        name: '电气火灾01',
        type: '电气火灾设备',
        pos: '0.5x0.1',
        rot: 0,
        state: '#58EDB6',
        floor: 0
      },
      {
        id: 'A_F15_12',
        name: '电气火灾02',
        type: '电气火灾设备',
        pos: '0.9x0.1',
        rot: 0,
        state: '#58EDB6',
        floor: 0
      },
      {
        id: 'A_F15_05',
        name: '感烟探测器02',
        type: '感烟探测器',
        pos: '0.95x0.9',
        rot: 0,
        state: '#58EDB6',
        floor: 0
      },
      {
        id: 'A_F15_06',
        name: '感烟探测器03',
        type: '感烟探测器',
        pos: '0.6x0.2',
        rot: 0,
        state: '#888888',
        floor: 0
      },
      {
        id: 'A_F15_07',
        name: '喷淋末端01',
        type: '喷淋末端',
        pos: '0.9x0.35',
        rot: 0,
        state: '#58EDB6',
        floor: 0
      },
      {
        id: 'A_F15_08',
        name: '通风口01',
        type: '通风口',
        pos: '0.5x0.8',
        rot: 0,
        state: '#58EDB6',
        floor: 0
      },
      {
        id: 'A_F15_09',
        name: '液位01',
        type: '液位',
        pos: '0.75x0.4',
        rot: 0,
        state: '#FF0000',
        floor: 0
      },
      {
        id: 'A_F15_10',
        name: '防火门01',
        type: '防火门',
        pos: '0.1x0.8',
        rot: 0,
        state: '#FF0000',
        floor: 0
      },
      {
        id: 'A_F15_11',
        name: '应急通道01',
        type: '应急通道',
        pos: '0.3x0.9',
        rot: 0,
        state: '#888888',
        floor: 0
      }
    ]
    /**
     * **测试 Js接受Unity数据****/
    window.unityMsg_Simple = function (obj) {
      console.log(obj)
      if (obj.indexOf('__Main__') >= 0) {
        return
      }
      showDeviceDetails(obj)
    }
    window.unityMsg_URL = function (obj) {
      // state.deviceInfoVisable = true
      console.log(obj)
    }

    watch(
      () => props.width,
      (count, prevCount) => {
        setSize()
      }
    )
    watch(
      () => props.height,
      (count, prevCount) => {
        setSize()
      }
    )
    watch(
      () => props.floorArea,
      (count, prevCount) => {
        console.log('props.floorArea', props.floorArea)
        if (props.floorArea === null) return
        state.propsFloorArea = props.floorArea
        toF(props.floorArea)
      }
    )
    // watch(
    //   () => props.builtAreaId,
    //   (count, prevCount) => {
    //     console.log('props.builtAreaId', props.builtAreaId)
    //     /***
    //      *根据建筑的area加载bim
    //      */
    //   }
    // )

    const setSize = () => {
      const rem = getRem()
      let theWidht = (props.width == null ? window.innerWidth : props.width)
      let theHeight = (props.height == null ? window.innerHeight : props.height)
      if (state.showScreenExitOut) {
        theWidht = window.innerWidth
        theHeight = window.innerHeight
      }

      const leftWidth = theWidht * (state.isShowFloor ? 0.53 : 1) - 0.16 * rem

      bimExhibitionCanvas.value.style.height = theHeight - 0.16 * rem + 'px'
      bimExhibitionCanvas.value.style.width = leftWidth + 'px'
      bimExhibitionLeftDiv.value.style.width = leftWidth + 'px'

      if (state.isShowFloor) {
        bimExhibitionRightDiv.value.style.width = theWidht - leftWidth - 0.32 * rem + 'px'
        bimExhibitionRightDiv.value.style.opacity = 1
      } else {
        bimExhibitionRightDiv.value.style.opacity = 0
      }

      bimExhibitionDiv.value.style.width = theWidht + 'px'
      bimExhibitionDiv.value.style.height = theHeight + 'px'
      state.imgHeight = (theHeight / 2) + 'px'
    }

    onMounted(() => {
      state.propsFloorArea = props.floorArea
      store.dispatch('bim/getFloorList', {
        areaParentId: builtAreaId
      })
      setSize()
      const canvas = document.querySelector('#js-bim-exhibition-canvas')
      const loaderUrl = buildUrl + '/main/Builds.loader.js'
      const config = {
        dataUrl: buildUrl + '/main/Builds.data',
        frameworkUrl: buildUrl + '/main/Builds.framework.js',
        codeUrl: buildUrl + '/main/Builds.wasm',
        streamingAssetsUrl: 'StreamingAssets',
        companyName: 'HK',
        productName: 'WanKeWeb-Test',
        productVersion: '0.2'
      }

      const createUnityInstance = () => {
        console.log('createUnityInstance')
      }
      createUnityInstance()
      // loadingBar.style.display = "block";

      const script = document.createElement('script')
      script.src = loaderUrl
      script.onload = () => {
        window.createUnityInstance(canvas, config, (progress) => {
          console.log('createUnityInstance progress')
        }).then((unityInstance) => {
          state.unityInstance = unityInstance
          setTimeout(() => {
            if (floorsTapBox.value) {
              floorsTapBox.value.style.display = 'block'
            }
            mainLoadDevice()
            // if (props.floorArea.areaCode === '15') {
            setTimeout(() => {
              toF(props.floorArea)
            }, 1000)
            // }
          }, 1800)

          state.loading = false
        }).catch((message) => {
          alert(message)
        })
      }
      document.body.appendChild(script)

      if (props.width == null && props.height == null) {
        /***
         * 没有作为组件引用
         ***/
        window.addEventListener('resize', setSize)
      } else {
        state.showScreenOut = true
      }
    })

    const floors = computed(() => store.state.bim.floors)

    const toF = (floor) => {
      console.log('floor', floor)
      if (!floor || floor.areaCode !== '15') {
        context.emit('showFloor', floor)
        return
      }

      if (!floorsTapBox.value || floorsTapBox.value.style.display !== 'block' || !state.unityInstance) {
        setTimeout(() => {
          toF(floor)
        }, 300)
        return
      }
      /***
       * 之前设备信息清空
       */
      devices = null

      /**
       * 视角切换到A栋
       * **/
      // state.unityInstance.SendMessage('GameManager', 'ChangeToTarget', 'A-F15')
      state.unityInstance.SendMessage('GameManager', 'ChangeTargetTo15')
      state.unityInstance.SendMessage('GameManager', 'ShowButtonPanel')
      if (state.isShowFloor === true) {
        return
      }
      context.emit('showFloor', floor)

      state.isShowFloor = true

      show3d()

      show2d()

      setSize()
      state.selectedFloor = {
        id: floor.id,
        floorName: floor.floorName,
        areaCode: floor.areaCode,
        parentId: floor.parentId
      }
      store.dispatch('bim/queryHasPoslistByAreaId', {
        areaId: floor.id
      }).then((res) => {
        if (res && res.success) {
          devices = res.result.map((o) => {
            return {
              id: o.id,
              name: o.devName,
              type: o.deviceModel,
              pos: o.bimX + 'x' + o.bimZ,
              state: (o.status === 1 ? '#58EDB6' : (o.status === 2 ? '#FF0000' : '#888888'))
            }
          })
        }
      })
    }
    const toAllF = () => {
      state.unityInstance.SendMessage('GameManager', 'ChangeToTarget', 'Init')
      if (state.isShowFloor === false) {
        return
      }
      context.emit('showFloor', null)
      state.isShowFloor = false
      setSize()
      state.selectedFloor = {
        id: -1,
        floorName: -1,
        areaCode: -1,
        parentId: -1
      }
    }

    const show2d = async () => {
      state.imgLoading = true
      /**
       * *请求接口获取图片 src
       **/

      state.imgSrc = '/bimExhibition/plan.png'

      loadDevice2D()
    }

    const mainLoadDevice = () => {
      store.dispatch('bim/queryHasPoslistByParentAreaIdAndStatus', {
        parentAreaId: builtAreaId,
        status: [2, 3]
      }).then((res) => {
        if (res && res.success) {
          const mainDeviceList = res.result.map((o) => {
            return {
              id: o.id,
              name: o.devName,
              type: o.deviceModel,
              pos: o.bimX + 'x' + o.bimZ,
              state: (o.status === 1 ? '#58EDB6' : (o.status === 2 ? '#FF0000' : '#888888'))
            }
          })
          const str = { sensorsMainList: mainDeviceList }
          state.unityInstance.SendMessage('GameManager', 'DeleteAllSensors')
          state.unityInstance.SendMessage('GameManager', 'CreateSensors', JSON.stringify(str))
          state.unityInstance.SendMessage('GameManager', 'ShowSensorExceptYanGan')
          console.log('mainLoadDevice finish', str)
        }
      })
    }

    // const o= '#58EDB6',//正常
    // const o='#FF0000',//故障
    // const  o='#888888'//离线
    const loadDevice = () => {
      // if (devices === null) {
      //   setTimeout(() => {
      //     loadDevice()
      //   }, 300)
      //   return
      // }
      state.floorLoading = true
      const str = {
        sensorsList: devices
      }
      state.unityInstance_floor.SendMessage('SensorController', 'DeleteAllSensors')

      setTimeout(() => {
        state.unityInstance_floor.SendMessage('SensorController', 'CreateSensors', JSON.stringify(str))
        state.unityInstance_floor.SendMessage('SensorController', 'ShowAllSensors')
        state.floorLoading = false
        console.log(str)
      }, 1500)
    }

    const loadDevice2D = () => {
      if (devices === null) {
        setTimeout(() => {
          loadDevice2D()
        }, 300)
        return
      }

      state.devicesImg = []
      for (let i = devices.length - 1; i >= 0; i--) {
        const device = {}

        const o = devices[i]
        const pos = o.pos.split('x')
        device.x = 'calc( ' + (parseFloat(pos[0]) * 100) + '% - 0.1rem)'
        device.y = 'calc( ' + (100 - parseFloat(pos[1]) * 100) + '% - 0.1rem)'
        device.title = o.name
        device.id = o.id
        device.src = '/icons/'

        if (o.type === '消火栓') {
          device.src += 'icon_2_'
        }
        if (o.type === '感烟探测器') {
          device.src += 'icon_7_'
        }
        if (o.type === '电气火灾设备') {
          device.src += 'icon_9_'
        }
        if (o.type === '喷淋末端') {
          device.src += 'icon_6_'
        }
        if (o.type === '消防栓') {
          device.src += 'icon_1_'
        }
        if (o.type === '通风口') {
          device.src += 'icon_8_'
        }
        if (o.type === '液位') {
          device.src += 'icon_4_'
        }
        if (o.type === '防火门') {
          device.src += 'icon_5_'
        }
        if (o.type === '应急通道') {
          device.src += 'icon_3_'
        }

        if (o.state === '#58EDB6') {
          device.src += 'default.png'
        }
        if (o.state === '#FF0000') {
          device.src += 'fault.png'
        }
        if (o.state === '#888888') {
          device.src += 'offline.png'
        }

        state.devicesImg.push(device)
      }
      setTimeout(() => {
        state.imgLoading = false
      }, 1500)
    }

    const show3d = async () => {
      state.floorLoading = true

      const canvasFloor = document.querySelector('#js-bim-exhibition-floor-canvas')
      const configFloor = {
        dataUrl: buildUrl + '/15/Builds.data',
        frameworkUrl: buildUrl + '/15/Builds.framework.js',
        codeUrl: buildUrl + '/15/Builds.wasm',
        streamingAssetsUrl: 'StreamingAssetsX',
        companyName: 'HK',
        productName: 'WanKeWeb-Test',
        productVersion: '0.2'
      }
      window.createUnityInstance(canvasFloor, configFloor, (progress) => {
        // progressBarFull.style.width = 100 * progress + "%";
      }).then((unityInstance) => {
        // loadingBar.style.display = "none";
        // fullscreenButton.onclick = () => {
        //   unityInstance.SetFullscreen(1);
        // };
        state.unityInstance_floor = unityInstance
        setTimeout(() => {
          loadDevice()
        }, 1000)
      }).catch((message) => {
        alert(message)
      })
    }

    const fullScreenClick = () => {
      state.showScreenOut = !state.showScreenOut
      state.showScreenExitOut = !state.showScreenExitOut

      const container = document.querySelector('#js-bim-exhibition-left-div')
      bimExhibitionCanvas.value.style.transition = 'none'
      container.style.transition = 'none'
      bimExhibitionRightDiv.value.style.transition = 'none'
      bimExhibitionDiv.value.style.position = 'fixed'

      bimExhibitionDiv.value.style.backgroundColor = '#2B3170'

      setSize()

      setTimeout(() => {
        bimExhibitionCanvas.value.style.transition = 'all 0.8s'
        container.style.transition = 'all 0.8s'
        bimExhibitionRightDiv.value.style.transition = 'all 0.8s'

        bimExhibitionDiv.value.style.backgroundColor = 'none'
      })
    }

    const bimSearch = ref('')

    const bimSearchResult = computed(() => store.state.bim.autocomplete)
    const onSearch = (searchText) => {
      console.log('searchText', searchText)

      if (searchText.replace(/(^s*)|(s*$)/g, '').length === 0) {
        bimSearchResult.value.list = []
        return
      }
      store.dispatch('bim/queryAutocompleteList', {
        query: searchText,
        areaId: builtAreaId
      })

      // state.bimSearchResult = !searchText ? [] : searchdata.filter((item) => item.name.indexOf(searchText) > -1)

      // bimSearchOptions.value = !searchText
      //   ? []
      //   : [mockVal(searchText), mockVal(searchText), mockVal(searchText), mockVal(searchText), mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 2), mockVal(searchText, 2), mockVal(searchText, 2), mockVal(searchText, 3)]
    }

    const onSelect = (value, options) => {
      console.log('onSelect', value, options)
      if (options.key_obj.areaCode === '15') {
        toF({
          id: options.key_obj.areaId,
          floorName: options.key_obj.areaName,
          areaCode: options.key_obj.areaCode,
          parentId: options.key_obj.areaParentId
        })
      }
    }

    const showDeviceDetails = (id) => {
      state.deviceId = id
      state.deviceInfoVisable = true
    }

    watch(bimSearch, () => {
      console.log('value', bimSearch.value)
    })

    const onFocus = () => {
      state.showPlaceHolder = false
    }
    const onBlur = () => {
      console.log(bimSearch.value)
      if (bimSearch.value === '') {
        state.showPlaceHolder = true
      }
    }

    const floorsTapPageUp = () => {
      window.mouseDown = true

      let mouseDownTime = 0

      const handler = () => {
        const top = parseFloat(floorsTapAbsolute.value.style.top)
        console.log(top)
        if (top >= 0) {
          return
        }

        floorsTapAbsolute.value.style.top = top + 0.3 + 'rem'

        mouseDownTime += 5

        if (window.mouseDown) {
          const timeOutTime = 200 - (mouseDownTime < 200 ? mouseDownTime : 0)
          window.topChangeTimeout = setTimeout(handler, timeOutTime)
        }
      }
      handler()
    }

    const floorsTapPageDown = () => {
      window.mouseDown = true

      let mouseDownTime = 0

      const rem = parseFloat(document.getElementsByTagName('html')[0].style.fontSize)

      const handler = () => {
        const top = parseFloat(floorsTapAbsolute.value.style.top)
        const height = parseInt(floorsTapShow.value.clientHeight) / rem
        console.log(top, height)
        if (top <= (-0.3 * floors.value.list.length + height).toFixed(1)) {
          return
        }
        floorsTapAbsolute.value.style.top = top - 0.3 + 'rem'

        mouseDownTime += 5
        if (window.mouseDown) {
          const timeOutTime = 200 - (mouseDownTime < 200 ? mouseDownTime : 0)
          window.topChangeTimeout = setTimeout(handler, timeOutTime)
        }
      }

      handler()
    }

    const mouseup = () => {
      window.mouseDown = false
      if (window.topChangeTimeout) {
        window.clearTimeout(window.topChangeTimeout)
        window.topChangeTimeout = null
      }
    }
    return {
      bimSearch,
      // bimSearchOptions,
      onSearch,
      onSelect,
      onFocus,
      onBlur,
      state,
      bimExhibitionCanvas,
      bimExhibitionLeftDiv,
      bimExhibitionRightDiv,
      bimExhibitionDiv,
      floorsTapBox,
      toF,
      toAllF,
      fullScreenClick,
      floorsTapAbsolute,
      floorsTapShow,
      floorsTapPageDown,
      floorsTapPageUp,
      mouseup,
      showDeviceDetails,
      bimSearchResult,
      floors
    }
  }
}
</script>

<style scoped>
#js-bim-exhibition-canvas {
  transition: all 0.8s;
  position: relative;
  z-index: 11;
  /*margin-right: 8px;*/
}

#js-bim-exhibition-floor-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.bim-exhibition-left-div {
  width: 100%;
  text-align: left;
  height: 100%;
  position: relative;
  background: rgba(136, 162, 247, 0.1);
  transition: all 0.8s;
}

.bim-exhibition-div {
  position: relative;
  top: 0;
  left: 0;
  padding: 0.08rem;
  z-index: 11;
}

.bim-exhibition-div div#js-floors-tap-box {
  position: absolute;
  left: 0.1rem;
  top: calc(50% - 1.8rem - 0.3rem);
  z-index: 13;
  min-width: 0px;
  overflow: inherit;
  text-align: center;
  margin: 0px;
  padding: 0px;
  list-style: none;
  background-color: #472f52;
  width: 0.4rem;
  font-size: 0.14rem;
  color: #9effff;
  line-height: 0.3rem;
}

.bim-exhibition-div div#js-floors-tap-box .floors-tap-item {
  cursor: pointer;
}

/*.bim-exhibition-div div#js-floors-tap-box .floors-tap-item .el-icon-arrow-up:before {*/
/*  content: "\e6e1";*/
/*}*/

/*.bim-exhibition-div div#js-floors-tap-box .floors-tap-item .el-icon-arrow-down:before {*/
/*  content: "\e6df";*/
/*}*/

.bim-exhibition-div div#js-floors-tap-box .floors-tap-item:hover {
  background-color: #9e9eff;
  transition: none;
}

.bim-exhibition-div div#js-floors-tap-box .floors-tap-item.floors-tap-item-selected {
  background-color: #9e9eff;
}

.bim-exhibition-div div#js-floors-tap-box .floors-tap-item.floors-tap-item-selected-disabled {
  color: #888888;
}

.bim-exhibition-div div#js-floors-tap-box .floors-tap-item.floors-tap-item-selected-disabled:hover {
  cursor: default;
  background-color: transparent;
}

.bim-exhibition-div div#js-floors-tap-box .floors-tap-show {
  position: relative;
  height: 3.6rem;
  overflow: hidden;
}

.bim-exhibition-div div#js-floors-tap-box .floors-tap-show .floors-tap-absolute {
  transition: all 0.8s;
  position: absolute;
  width: 100%;
  top: 0px;
}

.bim-exhibition-right-div {
  position: absolute;
  height: calc(100% - 0.16rem);
  width: 45%;
  right: 0.08rem;
  top: 0.08rem;
  /*background-color: yellow;*/
  opacity: 0;
  transition: all 0.8s;
}

.bim-exhibition-right-top-div, .bim-exhibition-right-bottom-div {
  background: rgba(136, 162, 247, 0.1);
  position: relative;

  width: 100%;
  height: calc(50% - 0.08rem);
}

div > .ant-spin {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
  left: 0px;
  top: 0px;
}

:deep() .ant-spin > .ant-spin-dot {
  top: calc(50% - 0.2rem);
}

.bim-exhibition-right-top-div {
  -webkit-touch-callout: none; /* iOS Safari */

  -webkit-user-select: none; /* Chrome/Safari/Opera */

  -khtml-user-select: none; /* Konqueror */

  -moz-user-select: none; /* Firefox */

  -ms-user-select: none; /* Internet Explorer/Edge */

  user-select: none;
  /* Non-prefixed version, currently

 not supported by any browser */
  margin-bottom: 0.16rem;
}

:deep() .bim-exhibition-right-top-div .ant-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
}

:deep() .bim-exhibition-right-top-div .ant-image img {
  align-items: center;
  margin: auto;
  opacity: 1;
  padding: 0.31rem;
}

.bimexhibition-screen {
  cursor: pointer;
  font-size: 0.24rem;
  color: #0088ff;
  position: absolute;
  right: 0.2rem;
  top: 0.18rem;
  z-index: 18;
}

:deep() .bimexhibitionspin.ant-spin, :deep() .bimexhibitionspin .ant-spin {
  max-height: none !important;
}

.bim-left-header {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 12;
  padding: 0.15rem 0.2rem;
  width: 100%;
}

.bim-auto-search-div {
  position: absolute;
  right: 0.7rem;
  top: 0.14rem;
  background-color: rgba(136, 162, 247, 0.2);
  border: 1px solid #88A2F7;
  border-radius: 4px;
  height: 0.32rem;
  width: 2.5rem;
}

.bim-auto-search-div .box {
  position: relative;
  width: 100%;
  height: 100%;
  font-family: "Microsoft YaHei";
}

.bim-auto-search-div .box:before {
  display: block;
  content: '';
  height: 0.3rem;
  width: 0.3rem;
  background-image: url(../../assets/images/monitor/icon-bim-search.png);
  background-repeat: no-repeat;
  background-position: 0.08rem 0.07rem;
  background-size: 0.18rem 0.18rem;
  position: absolute;
}

.bim-auto-search-div span {
  font-size: 0.1rem;
  position: absolute;
  color: #ffffff;
  left: 0.34rem;
  z-index: 0;
  top: 0;
  height: 100%;
  line-height: 0.295rem;
  opacity: 0.59;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
  /* Non-prefixed version, currently
   not supported by any browser */
}

:deep() .bim-auto-search-div input {
  left: 0px;
  top: 0px;
  position: absolute;
  display: block;
  background-color: transparent;
  color: #FFFFFF;
  font-size: 0.1rem;
  padding-left: 0.34rem;
  border: none;
  z-index: 1;
  outline: none;
  height: 100%;
  width: 100%;
}

:deep() .bim-auto-search-div .box .ant-select {
  height: 100%;
  display: block;
}

.bim-2d-box {
  position: absolute;
  width: calc(100% - 0.75rem);
  height: calc(100% - 0.6rem);
  left: 0.31rem;
  top: 0.31rem;
}

.bim-2d-box div {
  position: relative;
  width: 100%;
  height: 100%;
}

:deep() .bim-2d-box div img {
  padding: 0px !important;
  position: absolute;
  width: 0.2rem;
  height: 0.2rem;
  cursor: pointer;
  z-index: 8;
}

.bim-exhibition-box-div div.bim-title {
  font-size: 0.16rem;
  font-family: "Microsoft YaHei";
  font-weight: bold;
  position: relative;
  display: inline-block;
  line-height: 0.22rem;
  z-index: 0;
  padding-bottom: 0.06rem;
  color: #ffffff;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.bim-exhibition-box-div div.bim-title:after {
  content: "";
  position: absolute;
  padding-bottom: 0.1rem;
  background-color: #6677F0;
  left: 0;
  bottom: 0.05rem;
  z-index: -1;
}

.bim-exhibition-box-div div.bim-title.w1:after {
  width: 67.7%;
}

.bim-exhibition-box-div div.bim-title.w2:after {
  width: 60%;
}

.bim-exhibition-box-div > div.one-row {
  padding: 0.08rem;
  position: relative;
}

.bim-exhibition-box-div div.bim-title {
  font-size: 0.16rem;
  font-family: "Microsoft YaHei";
  font-weight: bold;
  position: relative;
  display: inline-block;
  line-height: 0.22rem;
  z-index: 0;
  padding-bottom: 0.06rem;
  color: #ffffff;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.bim-exhibition-box-div div.bim-title:after {
  content: "";
  position: absolute;
  padding-bottom: 0.1rem;
  background-color: #6677F0;
  left: 0;
  bottom: 0.05rem;
  z-index: -1;
}

.bim-exhibition-box-div div.bim-title.w1:after {
  width: 67.7%;
}

.bim-exhibition-box-div div.bim-title.w2:after {
  width: 60%;
}

/*123*/

div.bim-title {
  font-size: 0.16rem;
  font-family: "Microsoft YaHei";
  font-weight: bold;
  position: relative;
  display: inline-block;
  line-height: 0.22rem;
  z-index: 0;
  padding-bottom: 0.06rem;
  color: #ffffff;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

div.bim-title:after {
  content: "";
  position: absolute;
  padding-bottom: 0.1rem;
  background-color: #6677F0;
  left: 0;
  bottom: 0.05rem;
  z-index: -1;
}

div.bim-title.w1:after {
  width: 67.7%;
}

div.bim-title.w2:after {
  width: 60%;
}

</style>
<style>
.bimsearch-dropdown-class {
  background: none !important;
}

.bimsearch-dropdown-class .ant-select-dropdown-content {
  position: relative;
}

.bimsearch-dropdown-class .rc-virtual-list {
  margin-top: 0.27rem;
  background: rgba(136, 162, 247, 0.2);
  background-image: url(../../assets/images/monitor/bg-bim-search-center.png);
  background-size: 100%;
  border-radius: 4px;
  /*border: 1px solid #88A2F7;*/
  position: relative;
}

.bimsearch-dropdown-class .rc-virtual-list::before,
.bimsearch-dropdown-class .rc-virtual-list::after {
  content: '';
  display: block;
  background-image: url(../../assets/images/monitor/bg-bim-search-top.png);
  background-size: 100%;
  background-repeat: no-repeat;
  height: 4px;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

.bimsearch-dropdown-class .rc-virtual-list::after {
  background-image: url(../../assets/images/monitor/bg-bim-search-bottom.png);
  bottom: 0;
  top: auto;
}

.bimsearch-dropdown-class .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
  background: rgba(136, 162, 247, 0.2);
}

.bimsearch-dropdown-class .ant-select-item-option-active.ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
  background: rgba(136, 162, 247, 0.2);
}

.bimsearch-dropdown-class .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
  background: none;
}

.bimsearch-dropdown-class .rc-virtual-list .ant-select-item {
  color: #fff !important;
  font-weight: normal;
  width: 92%;
  margin-left: 3%;
}

.bimsearch-dropdown-class .rc-virtual-list-scrollbar {
  background: rgba(136, 162, 247, 0.4);
  width: 6px !important;
}

.bimsearch-dropdown-class .rc-virtual-list-scrollbar-thumb {
  background: #88A2F7 !important;
}

.bimsearch-dropdown-class .ant-select-item:after {
  content: '';
  display: block;
  position: absolute;
  width: 100%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  height: 1px;
  bottom: 0;
  left: 0;
}

.bimsearch-dropdown-class .bim-search-item {
  font-size: 0.1rem;
}

.bimsearch-dropdown-class .bim-search-item span {
  float: left;
  width: 85%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.bimsearch-dropdown-class .bim-search-item dd {
  float: left;
  width: 15%;
  text-align: right;
}

.bimsearch-dropdown-class .bim-search-item dd.disabled {
  color: #888888
}

</style>
<style>

/****
*   弹框 弹出子窗体公共样式 begin
*       <a-modal dialogClass="gh-modal-dialog" wrapClassName="gh-modal-dialog-wrap" ......
*   内部界面 有.gh-modal-dialog-header与.gh-modal-dialog-body  其他自定义
 */

.gh-modal-dialog .ant-modal-content {
  background: #292C60;
  border-radius: 8px;
  min-height: 0.48rem;
  color: #FFFFFF;
}

.gh-modal-dialog .ant-modal-content .ant-modal-body {
  padding: 0px;
}

.gh-modal-dialog-wrap {
  background-color: rgba(0, 0, 0, 0.79)
}

.gh-modal-dialog .ant-modal-content .ant-modal-close-x {
  width: 0.58rem;
  height: 0.38rem;
  font-size: 0.15rem;
  font-style: normal;
  line-height: 0.38rem;
}

.gh-modal-dialog .ant-modal-content .ant-modal-close-x svg {
  fill: #ffffff;
}

.gh-modal-dialog .ant-modal-content .ant-modal-body .gh-modal-dialog-header {
  background: #404B9F;
  border-radius: 8px 8px 0px 0px;
  height: 0.38rem;
  line-height: 0.38rem;
  padding: 0 0.32rem;
  font-size: 0.15rem;
}

.gh-modal-dialog .ant-modal-content .ant-modal-body .gh-modal-dialog-body {
  background: #292C60;
  padding: 0.16rem 0.16rem;
  font-size: 0.14rem;
}

/****
*   弹框 弹出子窗体公共样式 end
 */

</style>
