<template>
  <div class="commonHeader">{{title}}</div>
</template>
<script>
export default {
  name: "common-header",
  props: { title: String }
};
</script>
<style>
.commonHeader {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 8vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-sizing: border-box;
  background-color: #f0eff4;
}
</style>


