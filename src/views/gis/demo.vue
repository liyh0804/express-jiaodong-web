<template>
  <div class="test-btns">
          <span @click="state.positionSelectorShow=true"><svg t="1627991701516" class="icon" viewBox="0 0 1024 1024"
                                                              version="1.1"
                                                              xmlns="http://www.w3.org/2000/svg" p-id="15161" width="32"
                                                              height="32"><path
            d="M512 959.469288c-10.69969 0-16.60519-1.283226-20.36584-5.689582-2.261507-2.64934-229.644237-272.535093-290.237267-403.232784-21.890566-46.818305-33.44267-97.655134-33.44267-147.265018 0-187.090049 154.331971-339.226005 344.045777-339.226005s344.045777 153.187915 344.045777 341.429183c0 56.871265-10.660804 99.841939-36.789904 148.300604C747.006362 687.675068 534.795169 950.618713 532.675902 953.24247c-2.532683 3.166109-7.055696 6.227842-20.145829 6.227842L512 959.470311zM512 272.403087c-72.959685 0-132.325771 59.365062-132.325771 132.325771S439.040315 537.054629 512 537.054629s132.325771-59.365062 132.325771-132.325771S584.959685 272.403087 512 272.403087z"
            p-id="15162"></path></svg></span>
    <span @click="state.buildingSelectorShow=true"><svg t="1627991394739" class="icon" viewBox="0 0 1024 1024"
                                                        version="1.1"
                                                        xmlns="http://www.w3.org/2000/svg" p-id="9586" width="32"
                                                        height="32"><path
      d="M 896 822.857 h -36.5714 V 384 a 73.1429 73.1429 0 0 0 -73.1429 -73.1429 h -146.286 v 512 h -36.5714 V 201.143 a 73.1429 73.1429 0 0 0 -73.1429 -73.1429 H 237.714 a 73.1429 73.1429 0 0 0 -73.1429 73.1429 v 621.714 H 128 a 18.2857 18.2857 0 0 0 -18.2857 18.2857 v 36.5714 a 17.1886 17.1886 0 0 0 18.2857 18.2857 h 768 a 18.2857 18.2857 0 0 0 18.2857 -18.2857 v -36.5714 a 18.2857 18.2857 0 0 0 -18.2857 -18.2857 Z m -548.571 -164.571 a 18.2857 18.2857 0 0 1 -18.2857 18.2857 h -73.1429 a 18.2857 18.2857 0 0 1 -18.2857 -18.2857 v -36.5714 a 18.2857 18.2857 0 0 1 18.2857 -18.2857 h 73.1429 a 18.2857 18.2857 0 0 1 18.2857 18.2857 Z m 0 -146.286 a 18.2857 18.2857 0 0 1 -18.2857 18.2857 h -73.1429 a 18.2857 18.2857 0 0 1 -18.2857 -18.2857 v -36.5714 a 18.2857 18.2857 0 0 1 18.2857 -18.2857 h 73.1429 a 18.2857 18.2857 0 0 1 18.2857 18.2857 Z m 0 -146.286 a 18.2857 18.2857 0 0 1 -18.2857 18.2857 h -73.1429 a 18.2857 18.2857 0 0 1 -18.2857 -18.2857 v -36.5714 a 18.2857 18.2857 0 0 1 18.2857 -18.2857 h 73.1429 a 18.2857 18.2857 0 0 1 18.2857 18.2857 Z m 182.857 292.571 a 18.2857 18.2857 0 0 1 -18.2857 18.2857 h -73.1429 a 18.2857 18.2857 0 0 1 -18.2857 -18.2857 v -36.5714 a 18.2857 18.2857 0 0 1 18.2857 -18.2857 h 73.1429 a 18.2857 18.2857 0 0 1 18.2857 18.2857 Z m 0 -146.286 a 18.2857 18.2857 0 0 1 -18.2857 18.2857 h -73.1429 a 18.2857 18.2857 0 0 1 -18.2857 -18.2857 v -36.5714 a 18.2857 18.2857 0 0 1 18.2857 -18.2857 h 73.1429 a 18.2857 18.2857 0 0 1 18.2857 18.2857 Z m 0 -146.286 a 18.2857 18.2857 0 0 1 -18.2857 18.2857 h -73.1429 a 18.2857 18.2857 0 0 1 -18.2857 -18.2857 v -36.5714 a 18.2857 18.2857 0 0 1 18.2857 -18.2857 h 73.1429 a 18.2857 18.2857 0 0 1 18.2857 18.2857 Z m 274.286 292.571 a 18.2857 18.2857 0 0 1 -18.2857 18.2857 h -73.1429 a 18.2857 18.2857 0 0 1 -18.2857 -18.2857 v -36.5714 a 18.2857 18.2857 0 0 1 18.2857 -18.2857 h 73.1429 a 18.2857 18.2857 0 0 1 18.2857 18.2857 Z m 0 -146.286 a 18.2857 18.2857 0 0 1 -18.2857 18.2857 h -73.1429 a 18.2857 18.2857 0 0 1 -18.2857 -18.2857 v -36.5714 a 18.2857 18.2857 0 0 1 18.2857 -18.2857 h 73.1429 a 18.2857 18.2857 0 0 1 18.2857 18.2857 Z"
      p-id="9587"></path></svg></span>
  </div>

  <sl-gis-building-selector :show="state.buildingSelectorShow"
                            @cancel="buildingSelectorCancel"
                            @ok="buildingSelectorOk"
                            :title="state.buildingSelectorTitle"
                            :address="state.buildingSelectorAddress"
                            :lnglat="state.buildingSelectorLnglat"
                            :id="state.buildingSelectorId"></sl-gis-building-selector>
  <sl-gis-position-selector :show="state.positionSelectorShow"
                            @cancel="positionSelectorCancel"
                            @ok="positionSelectorOK"
                            :title="state.positionSelectorTitle"
                            :address="state.positionSelectorAddress"
                            :lnglat="state.positionSelectorLnglat"
  ></sl-gis-position-selector>
</template>

<script>
import { reactive } from 'vue'
import GisBuildingSelector from './gisBuildingSelector'
import GisPositionSelector from './gisPositionSelector'

export default {
  components: {
    'sl-gis-building-selector': GisBuildingSelector,
    'sl-gis-position-selector': GisPositionSelector
  },
  setup(props, context) {
    const state = reactive({
      buildingSelectorTitle: '动态标题',
      positionSelectorTitle: '标题动态',
      buildingSelectorAddress: '即墨区政府',
      positionSelectorAddress: '即墨服装批发市场',
      buildingSelectorShow: false,
      positionSelectorShow: false,
      buildingSelectorLnglat: [120.388649, 36.372378],
      positionSelectorLnglat: [120.388649, 36.372378],
      buildingSelectorId: '1421040915322757122'

    })

    const buildingSelectorOk = (selectedInfo) => {
      console.log(selectedInfo)
      alert('3d楼体id:' + selectedInfo.id + '；地址：' + selectedInfo.address + '；经纬度：' + selectedInfo.lnglat
      )
      state.buildingSelectorShow = false
    }
    const buildingSelectorCancel = () => {
      state.buildingSelectorShow = false
    }

    const positionSelectorOK = (selectedInfo) => {
      console.log(selectedInfo)
      alert('地址：' + selectedInfo.address + '；经纬度：' + selectedInfo.lnglat
      )
      state.positionSelectorShow = false
    }

    const positionSelectorCancel = () => {
      state.positionSelectorShow = false
    }

    return {
      state,
      buildingSelectorOk,
      buildingSelectorCancel,
      positionSelectorOK,
      positionSelectorCancel
    }
  }
}
</script>

<style scoped>
.test-btns {
  /*position: absolute;*/
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
