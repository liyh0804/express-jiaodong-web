<template>
  <a-modal v-model="props.visible" title="title" on-ok="handleOk">
    <template v-slot:footer>
        <a-button key="back" @click="handleCancel">
          Return
        </a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
          Submit
        </a-button>
      </template>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
  </a-modal>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  setup() {
  },
  data() {
    return {
      loading: false
      // visible: false
    }
  },
  methods: {
    // showModal() {
    //   this.visible = true
    // },
    handleOk(e) {
      this.loading = true
      setTimeout(() => {
        // this.visible = false
        this.loading = false
      }, 3000)
    },
    handleCancel(e) {
      // this.visible = false
    }
  }
}
</script>
