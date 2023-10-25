<!--  -->
<template>
<div>
<el-rate
  v-model="value"
  :texts="iconClasses"
  show-text>
</el-rate>
</div>

</template>

<script>


export default {
components: {},
    data() {
      return {
        value: null,
        iconClasses: ['1', '2', '3', '4', '5'], // 等同于 { 2: 'icon-rate-face-1', 4: { value: 'icon-rate-face-2', excluded: true }, 5: 'icon-rate-face-3' }
      }
    },
computed: {},
watch: {},
methods: {

},
created() {

},
mounted() {

},
}
// 说明： 本页面用于测试
</script>
<style scoped>

</style>