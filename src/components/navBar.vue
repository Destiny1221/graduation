<template>
  <ul class="navBar">
    <router-link tag="li" to="/home">
      <i class="iconfont icon-home"></i> 首页
    </router-link>
    <router-link tag="li" to="/category">
      <i class="iconfont icon-car"></i>类别
    </router-link>
    <router-link tag="li" to="/list">
      <i class="iconfont icon-interface4"></i>预约单
    </router-link>
    <router-link tag="li" to="/mine">
      <i class="iconfont icon-mine"></i>个人中心
    </router-link>
  </ul>
</template>

<script>
import defaultUrl from "@/common/util.js";
const url = defaultUrl.defaultUrl;
export default {
  name: "navBar",
  data() {
    return {};
  },
  created() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navBar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 10vh;
  display: flex;
  box-sizing: border-box;
  border-top: 1px solid #e9e9e9;
  background-color: #fff;
}
.navBar > li {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  color: #333;
}
.router-link-active {
  color: #d13134 !important;
}
</style>
