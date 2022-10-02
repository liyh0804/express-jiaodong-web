<template>
  <div class="test-btns">
    <sj-area-tree :read-only="true" @onSelected="selected" ></sj-area-tree>
  </div>
</template>

<script>
import AreaTree from '../../components/areaTree'

export default {
  components: {
    'sj-area-tree': AreaTree
  },
  setup(props, context) {
    const selected = (item) => {
      console.log(item)
    }
    return {
      selected
    }
  }
}
</script>

<style scoped>
.test-btns {
  width: 300px;
}
</style>
