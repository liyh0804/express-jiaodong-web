<template>
  <div class="danger-wrap">
    <div class="content">
      <h2>隐患区域TOP10信息统计</h2>
      <div id="hidden-danger-el"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts/core'
import { DatasetComponent, GridComponent, VisualMapComponent } from 'echarts/components'
import { BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

export default {
  mounted () {
    echarts.use([DatasetComponent, GridComponent, VisualMapComponent, BarChart, CanvasRenderer])
    const chartDom = document.getElementById('hidden-danger-el')
    const myChart = echarts.init(chartDom, 'dark')
    let option = null

    option = {
      dataset: {
        source: [
          ['score', 'amount', 'product'],
          [89.3, 58212, '10楼'],
          [89.3, 58212, '9楼'],
          [57.1, 78254, '8楼'],
          [74.4, 41032, '7楼'],
          [50.1, 12755, '6楼'],
          [89.7, 20145, '5楼'],
          [68.1, 79146, '4楼'],
          [19.6, 91852, '3楼'],
          [10.6, 101852, '2楼'],
          [32.7, 20112, '1楼']
        ]
      },
      grid: { containLabel: true },
      xAxis: { name: 'amount' },
      yAxis: { type: 'category' },
      // visualMap: {
      //   orient: 'horizontal',
      //   left: 'center',
      //   min: 10,
      //   max: 100,
      //   text: ['High Score', 'Low Score'],
      //   // Map the score column to color
      //   dimension: 0,
      //   inRange: {
      //     color: ['#65B581', '#FFCE34', '#FD665F']
      //   }
      // },
      series: [
        {
          type: 'bar',
          encode: {
            // Map the "amount" column to X axis.
            x: 'amount',
            // Map the "product" column to Y axis
            y: 'product'
          }
        }
      ]
    }

    option && myChart.setOption(option)
  }
}

</script>

<style lang="less" scoped>
.danger-wrap {
  width: 100%;
  height: 100%;
  background-color: #fff;

  #hidden-danger-el {
    width: 600px;
    height: 500px;
  }
}
</style>
