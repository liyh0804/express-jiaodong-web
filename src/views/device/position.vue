<template>
  <div id="js-device-position" class="device-position clearfix">
    <div class="device-position-left">
      <sj-area-tree :read-only="true" @onSelected="areaSelected" ></sj-area-tree>
    </div>
    <div class="device-position-right clearfix">
      <div class="right-device-list">

        <a-spin :spinning="state.deviceList.loading">
          <div class="device-list">
            <a-select class="device-type"
                      v-model:value="state.deviceType"
            >
              <a-select-option value="1">Lucy</a-select-option>
              <a-select-option value="2">独立式烟感探测器</a-select-option>
              <a-select-option value="3">Disabled</a-select-option>
              <a-select-option value="4">yiminghe</a-select-option>
            </a-select>
            <div class="device-item clearfix" :class="state.deviceSelectedItem.id===item.id?'device-item-selected':''"
                 v-for="item in state.deviceList.list"
                 :key="item.id"
                 @mousedown.stop="deviceClick($event,item);state.edit&&!item.isIn&&deviceDrag($event,item)">
              <div class="item-img"><img :src="item.imgSrc"/></div>
              <div>
                <dt>{{ item.devName }}</dt>
                <dd>{{ item.addr }}</dd>
              </div>
            </div>
          </div>
          <div class="device-list-page" v-show="!state.deviceList.loading">
            <a-pagination size="small" :total="300" simple/>
          </div>
        </a-spin>
      </div>
      <div class="right-device-plan">
        <p>
          操作提示： <br/>
          1 长按鼠标左键可拖动地图上下移动，通过鼠标滚轮可放大缩小 <br/>
          2 点击“进入编辑模式” <br/>
          3 鼠标拖动左侧设备列表中的设备，移动至2D平面图中后释放鼠标定位 <br/>
          4 2D平面图中右键设备进行删除 <br/>
          5 点击保存
        </p>

        <div class="btns" v-if="state.edit">
          <a-button style="margin-right: 8px" key="back" @click="cancelEdit">取 消</a-button>
          <a-button key="submit" type="primary" @click="okEdit">确 定</a-button>
        </div>
        <div class="btns" v-else>
          <a-button key="submit" type="primary" @click="toEdit">编辑模式</a-button>
        </div>
        <div id="js-wrap" class="device-plan-image-wrap" v-image-drag ref="devicePlanImageWrap"
             @click="state.deviceSelectedItemDelete = false"
             @wheel.stop="mouseWheel">
          <div id="js-cloth" class="cloth-div" ref="devicePlanClothDiv"
               :style="{'transform': 'scale('+state.scale.__transform_scale+')','-webkit-transform':'scale('+state.scale.__transform_scale+')','transform-origin':state.scale.__transform_origin,'-webkit-transform-origin':state.scale.__transform_origin }">
            <div id="js-cloth-box" class="cloth-box" ref="devicePlanClothBox">
              <img class="cloth-imgs" src="/temp/a.png" draggable="false"/>
              <img class="cloth-icons" :src="item.imgSrc" :style='{left:item.left,top:item.top}'
                   v-for="item in state.deviceInImgIcons" :key="item.id"
                   @mousedown.stop="deviceClick($event,item);state.edit&&deviceImgDrag($event,item)"
                   @contextmenu.prevent="contextmenu($event)"/>

              <div v-show="state.deviceSelectedItem.id!==-1&&state.deviceSelectedItem.isIn"
                   class="ant-tooltip ant-tooltip-placement-top"
                   :style='{left:state.deviceSelectedItem.left,top:state.deviceSelectedItem.top}'>
                <div class="ant-tooltip-content">
                  <div class="ant-tooltip-arrow">
                    <span class="ant-tooltip-arrow-content"></span>
                  </div>
                  <div class="ant-tooltip-inner" role="tooltip">
                    <span v-if="!state.deviceSelectedItemDelete">{{ state.deviceSelectedItem.devName }}</span>
                    <span v-if="state.deviceSelectedItemDelete">是否删除此设备定位<a-button style="margin-left: 5px" ghost
                                                                                   size="small"
                                                                                   @click="deleteImgIcon()">确定</a-button></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import { Modal } from 'ant-design-vue'
import AreaTree from '../../components/areaTree'

export default {
  components: {
    'sj-area-tree': AreaTree
  },
  setup(props, context) {
    const state = reactive({
      edit: false,
      deviceType: '2',
      deviceList: {
        list: [],
        loading: true
      },
      deviceSelectedItem: { id: -1 },
      deviceSelectedItemDelete: false,
      scale: {
        __transform_scale: 1,
        __transform_origin: '50% 50%',
        clothX: 0,
        clothY: 0
      },
      deviceInImgIcons: []
    })
    const devicePlanImageWrap = ref()
    const devicePlanClothDiv = ref()
    const devicePlanClothBox = ref()

    onMounted(() => {
      setTimeout(() => {
        state.deviceList.list = [
          {
            id: '123123',
            imgSrc: '/icons/icon_7_fault.png',
            devName: '独立式感烟探测器',
            addr: '1楼3街101号'
          }, {
            id: '3333',
            imgSrc: '/icons/icon_7_default.png',
            devName: '独立式感烟探测器',
            addr: '1楼3街101号'
          }, {
            id: '1111',
            imgSrc: '/icons/icon_7_fault.png',
            devName: '独立式感烟探测器',
            addr: '1楼3街101号'
          }, {
            id: '543',
            imgSrc: '/icons/icon_7_default.png',
            devName: '独立式感烟探测器',
            addr: '1楼3街101号'
          }, {
            id: '1',
            imgSrc: '/icons/icon_7_default.png',
            devName: '独立式感烟探测器',
            addr: '1楼3街101号'
          }, {
            id: '2',
            imgSrc: '/icons/icon_7_default.png',
            devName: '独立式感烟探测器',
            addr: '1楼3街101号'
          }, {
            id: '3',
            imgSrc: '/icons/icon_7_default.png',
            devName: '独立式感烟探测器',
            addr: '1楼3街101号'
          }, {
            id: '4',
            imgSrc: '/icons/icon_7_default.png',
            devName: '独立式感烟探测器',
            addr: '1楼3街101号'
          }, {
            id: '5',
            imgSrc: '/icons/icon_7_offline.png',
            devName: '独立式感烟探测器',
            addr: '1楼3街101号'
          }, {
            id: '6',
            imgSrc: '/icons/icon_7_fault.png',
            devName: '独立式感烟探测器',
            addr: '1楼3街101号'
          }, {
            id: '7',
            imgSrc: '/icons/icon_7_default.png',
            devName: '独立式感烟探测器',
            addr: '1楼3街101号'
          }, {
            id: '8',
            imgSrc: '/icons/icon_7_default.png',
            devName: '独立式感烟探测器',
            addr: '1楼3街101号'
          }
        ]
        state.deviceList.loading = false
      }, 2000)
    })

    const toEdit = () => {
      state.edit = true
    }
    const exitEdit = () => {
      state.edit = false
      state.deviceSelectedItemDelete = false
    }
    const cancelEdit = () => {
      Modal.confirm({
        title: '取消编辑',
        content: '您确定要取消编辑吗？未提交的改动将会丢失',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          exitEdit()
        },
        onCancel() {
        }
      })
    }

    const okEdit = () => {
      Modal.confirm({
        title: '确定提交',
        content: '确定要提交么？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          exitEdit()
        },
        onCancel() {
        }
      })
    }

    /****
     * 鼠标缩放 调整 比例值transform_scale
     */
    const mouseWheel = (eve) => {
      if (state.scale.__transform_scale <= 0.125 && eve.deltaY <= 0) {
        return
      }
      if (state.scale.__transform_scale >= 3 && eve.deltaY >= 0) {
        return
      }
      state.scale.__transform_scale = state.scale.__transform_scale + eve.deltaY / Math.abs(eve.deltaY) * 0.125
      if (eve.target.id === 'js-cloth') {
        const px = eve.offsetX / devicePlanClothDiv.value.clientWidth * 100 + '%'
        const py = eve.offsetY / devicePlanClothDiv.value.clientHeight * 100 + '%'
        const origin = px + ' ' + py
        console.log(origin)
        // state.scale.__transform_origin = origin
        // } else if (eve.target.id === 'js-wrap') {
        //   const rect = eve.target.getBoundingClientRect()
        //   const px = eve.offsetX / rect.width * 100 + '%'
        //   const py = eve.offsetY / rect.height * 100 + '%'
        //   const origin = px + ' ' + py
        //   state.scale.__transform_origin = origin
      } else {
        // const targetRect = eve.target.getBoundingClientRect()
        const rect = devicePlanClothDiv.value.getBoundingClientRect()
        const px = (eve.x - rect.left) / rect.width * 100 + '%'
        const py = (eve.y - rect.top) / rect.height * 100 + '%'
        const origin = px + ' ' + py
        console.log(origin)
        // state.scale.__transform_origin = origin

        // let top = 0
        // let left = 0
        // let parent = eve.target
        // do {
        //   const rect = parent.getBoundingClientRect()
        //   const parentRect = parent.parentNode.getBoundingClientRect()
        //   top += (rect.top / state.scale.__transform_scale - parentRect.top / state.scale.__transform_scale)
        //   left += (rect.left / state.scale.__transform_scale - parentRect.left / state.scale.__transform_scale)
        //   console.log(left)
        //   parent = parent.parentNode
        // } while (parent.id !== 'js-cloth')

        // console.log('eve.offsetX' + eve.offsetX)
        // const px = (611 + eve.offsetX) / devicePlanClothDiv.value.clientWidth * 100 + '%'
        // const py = (365 + eve.offsetY) / devicePlanClothDiv.value.clientHeight * 100 + '%'
        // const origin = px + ' ' + py
        // state.scale.__transform_origin = origin

        // state.scale.__transform_origin = '50% 50%'
      }

      //
      // // console.log(devicePlanClothDiv.value.clientWidth)
      // const px = eve.offsetX / devicePlanClothDiv.value.clientWidth * 100 + '%'
      // const py = eve.offsetY / devicePlanClothDiv.value.clientHeight * 100 + '%'

      // const topDiffer = ((1 - state.scale.__transform_scale) * devicePlanClothDiv.value.clientWidth) / 2
      // const leftDiffer = ((1 - state.scale.__transform_scale) * devicePlanClothDiv.value.clientHeight) / 2
      // const top = devicePlanClothDiv.value.style.top === '' ? 0 : parseFloat(devicePlanClothDiv.value.style.top)
      // const left = devicePlanClothDiv.value.style.left === '' ? 0 : parseFloat(devicePlanClothDiv.value.style.left)
      // devicePlanClothDiv.value.style.top = top + topDiffer + 'px'
      // devicePlanClothDiv.value.style.left = left + leftDiffer + 'px'
      //
      // const origin = px + ' ' + py
      // state.scale.__transform_origin = origin
      // console.log(origin)
      /*
       var clothcontent=this.$refs[this.theTab.tab_id+'_c'][0];
       var workbench=this.$refs[this.theTab.tab_id+'_w'][0];
       var workbench_=workbench.getBoundingClientRect();
       //
       // logger("e.x:"+e.x+",e.y:"+e.y);
       // logger("workbench_.x:"+workbench_.x+",workbench_.y:"+workbench_.y);
       var x=eve.x-workbench_.x;
       var y=eve.y-workbench_.y;
       var d =  [_[0] / 100 * workbench.clientWidth * (1 - this.theTab.__transform_scale), _[1] / 100 * workbench.clientHeight * (1 - theTab.__transform_scale)],
       e =getOffset(workbench,clothcontent, !0),
       f = [parseInt(workbench.style.left, 10) || 0, parseInt(workbench.style.top, 10) || 0],
       g = workbench.clientWidth,
       h = workbench.clientHeight,
       i = [(eve.x - (e.left + f[0]) - d[0]) / this.theTab.__transform_scale, (eve.y - (e.top + f[1]) - d[1]) / this.theTab.__transform_scale];
       var s= {
       w: g,
       h: h,
       xy: i,
       xScale: i[0] / g,
       yScale: i[1] / h,
       o: [i[0] / g * 100, i[1] / h * 100]
       }
       this.theTab.__transform_origin=s.o[0]+'% '+s.o[1]+'% 0px';
       (function(a, b, c, d) {
       var e, f, g, h, i = _[0] / 100 * b,
       j = _[1] / 100 * c;
       e = -(i * (1 - this.theTab.__transform_scale)),
       f = -(j * (1 - this.theTab.__transform_scale)),
       _ = a,
       this.theTab.__transform_origin=_[0] + '% ' + _[1] + '% 0px';
       i = _[0] / 100 * b,
       j = _[1] / 100 * c,
       g = -(i * (1 - this.theTab.__transform_scale)),
       h = -(j * (1 - this.theTab.__transform_scale));
       // var k = Pa(q, g - e, h - f, d);
       // y && y(_, k)
       })(s.o, s.w, s.h, eve);
       */
    }

    const svgNoDragDownIcon = '<svg t="1628221847537" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2668" width="16" height="16"><path d="M791.04 170.666667L853.333333 228.906667 275.626667 853.333333 213.333333 795.093333z" p-id="2669" fill="#000000"></path><path d="M512 981.333333C252.8 981.333333 42.666667 771.2 42.666667 512S252.8 42.666667 512 42.666667s469.333333 210.133333 469.333333 469.333333-210.133333 469.333333-469.333333 469.333333z m0-85.333333a384 384 0 1 0 0-768 384 384 0 0 0 0 768z" p-id="2670" fill="#000000"></path></svg>'
    const iconUrl = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgNoDragDownIcon)))

    const deviceDrag = (e, item) => {
      let oDiv = e.target
      while (oDiv.className.indexOf('device-item') === -1) {
        oDiv = oDiv.parentNode
      }

      /*****
       * 鼠标按下，计算当前元素距离可视区的距离
       */
      let disX = e.clientX
      let disY = e.clientY

      const newX = oDiv.cloneNode(true)
      const elRect = oDiv.getBoundingClientRect()
      console.log(elRect)
      newX.id = 'X0000000000'
      newX.style.left = elRect.left + 'px'
      newX.style.top = elRect.top + 'px'
      newX.style.width = elRect.width + 'px'
      newX.style.height = elRect.height + 'px'
      newX.style.position = 'fixed'
      newX.style.boxShadow = '0 2px 12px 0 rgb(0 0 0 / 10%)'
      newX.style.zIndex = 6
      newX.style.backgroundColor = 'rgba(102, 119, 240,0.5)'
      const clothBox = document.getElementById('js-cloth-box').getBoundingClientRect()
      document.body.appendChild(newX)
      document.onmousemove = function (e) {
        /****
         *通过事件委托，计算移动的距离
         */
        const l = e.clientX - disX
        const t = e.clientY - disY
        /****
         *移动当前元素
         */
        newX.style.left = parseFloat(newX.style.left) + l + 'px'
        newX.style.top = parseFloat(newX.style.top) + t + 'px'
        disX = e.clientX
        disY = e.clientY
        e.stopPropagation()

        if (e.x < clothBox.right &&
          e.x > clothBox.left &&
          e.y < clothBox.bottom &&
          e.y > clothBox.top) {
          /****
           * 在内容区域内
           */

          newX.style.cursor = 'pointer'
          console.log('在内容区域内')
        } else {
          newX.style.cursor = 'url(' + iconUrl + ') 16 16,auto'
          console.log('在内容区域外')
        }
      }
      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
        document.body.removeChild(newX)
        if (e.x < clothBox.right &&
          e.x > clothBox.left &&
          e.y < clothBox.bottom &&
          e.y > clothBox.top) {
          /****
           * 在内容区域内
           */

          const _left = (e.x - (parseFloat(clothBox.left)))
          const _top = (e.y - (parseFloat(clothBox.top)))
          item.left = 'calc(' + _left / clothBox.width * 100 + '% - 7px)'
          item.top = 'calc(' + _top / clothBox.height * 100 + '% - 7px)'
          item.isIn = true
          state.deviceInImgIcons.push(item)
        } else {
          console.log('在内容区域外')
        }

        e.stopPropagation()
      }
      e.stopPropagation()
    }

    const deviceImgDrag = (e, item) => {
      const oDiv = e.target
      /****
       * 鼠标按下，计算当前元素距离可视区的距离
       */
      const disX = e.clientX - oDiv.offsetLeft * state.scale.__transform_scale
      const disY = e.clientY - oDiv.offsetTop * state.scale.__transform_scale

      const clothBox = document.getElementById('js-cloth-box').getBoundingClientRect()

      document.onmousemove = function (e) {
        if (e.x < clothBox.right &&
          e.x > clothBox.left) {
          const _left = e.clientX - disX
          // item.left = _left + 'px'
          // item.left = 'calc(' + _left / clothBox.width * 100 + '% - 7px)'
          item.left = _left / clothBox.width * 100 + '%'
        }

        if (e.y < clothBox.bottom &&
          e.y > clothBox.top) {
          const _top = e.clientY - disY
          // item.top = _top + 'px'
          // item.top = 'calc(' + _top / clothBox.height * 100 + '% - 7px)'
          item.top = _top / clothBox.height * 100 + '%'
        }

        e.stopPropagation()
      }
      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
        e.stopPropagation()
      }
      e.stopPropagation()
    }

    const contextmenu = (e) => {
      e.preventDefault()
    }

    const deviceClick = (e, item) => {
      state.deviceSelectedItem = item
      state.deviceSelectedItemDelete = false
      if (e.target.className.indexOf('cloth-icons') !== -1) {
        if (e.button === 2 && state.edit) {
          console.log('右键')
          state.deviceSelectedItemDelete = true
        }
      }
    }

    const deleteImgIcon = () => {
      state.deviceSelectedItem.isIn = false
      for (let i = state.deviceInImgIcons.length - 1; i >= 0; i--) {
        if (state.deviceInImgIcons[i].id === state.deviceSelectedItem.id) {
          state.deviceInImgIcons.splice(i, 1)
        }
      }
      state.deviceSelectedItem = { id: -1 }
    }

    const areaSelected = (item) => {
      console.log(item)
    }
    return {
      state,
      toEdit,
      okEdit,
      cancelEdit,
      mouseWheel,
      devicePlanImageWrap,
      devicePlanClothDiv,
      devicePlanClothBox,
      deviceDrag,
      deviceImgDrag,
      deviceClick,
      contextmenu,
      deleteImgIcon,
      areaSelected
    }
  },
  /****
   * 注册局部组件指令
   */
  directives: {
    'image-drag': (el) => {
      /****
       * 获取当前元素
       */
      const oDiv = el.childNodes[0]

      el.onmousedown = function (e) {
        /****
         * 鼠标按下，计算当前元素距离可视区的距离
         */
        const disX = e.clientX - oDiv.offsetLeft
        const disY = e.clientY - oDiv.offsetTop

        document.body.style.cursor = 'move'

        document.onmousemove = function (e) {
          /****
           * 通过事件委托，计算移动的距离
           */
          const l = e.clientX - disX
          const t = e.clientY - disY

          /****
           * 移动当前元素
           */
          oDiv.style.left = l + 'px'
          oDiv.style.top = t + 'px'
          e.stopPropagation()
        }
        document.onmouseup = function (e) {
          document.onmousemove = null
          document.onmouseup = null
          document.body.removeAttribute('style')
          e.stopPropagation()
        }

        e.stopPropagation()
      }
    }
  }
}
</script>

<style scoped>
.device-position {
  height: 100%;
}

.device-position > div {
  float: left;
  min-height: 20px;
  background-color: #FFFFFF;
  height: 100%;
}

.device-position-left {
  width: 280px;
  padding: 24px;
}

.device-position-right {
  width: calc(100% - 280px - 16px);
  margin-left: 16px;
  padding-bottom: 10px;
}

.device-position-right > div {
  float: left;
  height: 100%;
}

.right-device-list {
  width: 250px;
}

.device-type {
  width: calc(100% - 40px);
  margin: 0px 20px 10px 20px;
}

.device-list {
  width: 100%;
  height: calc(100% - 28px);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: 20px;
}

.device-list-page {
  text-align: center;
}

.right-device-plan {
  position: relative;
  width: calc(100% - 250px);
}

.device-item {
  height: 60px;
  width: 100%;
  padding: 6px 5px 6px 18px;
  background-color: #FFFFFF;
}

.device-item-selected {
  border: 1px solid #6677F0;
}

.device-item > div {
  float: left;
  height: 100%;
}

.device-item .item-img {
  padding-right: 8px;
}

.device-item img {
  -webkit-user-drag: none;
}

.device-item dt {
  font-size: 14px;
  line-height: 22px;
}

.device-item dd {
  font-size: 12px;
  color: #999999;
  line-height: 20px;
}

.device-item:hover {
  background: rgba(102, 119, 240, 0.2);
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

:deep() .ant-spin-nested-loading {
  height: 100%;
  width: 100%;
}

:deep() .ant-spin-nested-loading > div > .ant-spin {
  max-height: unset;
}

:deep() .ant-spin-container {
  width: 100%;
  height: 100%;
}

.right-device-plan p {
  color: #999999;
  font-size: 12px;
  margin: 25px;
  line-height: 20px;
}

.right-device-plan .btns {
  position: absolute;
  right: 24px;
  top: 16px;
}

.device-plan-image-wrap {
  height: calc(100% - 170px);
  width: calc(100% - 20px);
  text-align: center;
  position: relative;
  margin: 0px 10px;
  overflow: hidden;
  cursor: move;
  border: 1px solid rgba(230, 230, 230, 1);
}

.device-plan-image-wrap .cloth-div {
  position: relative;
  width: 100%;
  height: 100%;
  /*border: 1px solid rgba(230, 230, 230, 1);*/
  z-index: 1;
}

/*.device-plan-image-wrap .cloth-mask {*/
/*  position: absolute;*/
/*  width: 100%;*/
/*  height: 100%;*/
/*  z-index: 2;*/
/*  left: 0px;*/
/*  top: 0px;*/
/*}*/

.device-plan-image-wrap .cloth-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  display: inline-block;
}

.device-plan-image-wrap .cloth-imgs {
  -webkit-user-drag: none;
  height: 5.6rem;
}

.device-plan-image-wrap .cloth-icons {
  position: absolute;
  -webkit-user-drag: none;
  z-index: 3;
  cursor: pointer;
}

div.ant-tooltip {
  transform: translate3d(calc(-50% + 7px), -100%, 0);
  height: 42px;
}

div.ant-tooltip-content div.ant-tooltip-inner span {
  white-space: nowrap;
}
</style>
