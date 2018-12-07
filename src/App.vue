<template>
  <div class="app">
    <router-view/>
    <navbar v-show="tabHidden"></navbar>
  </div>
</template>

<script>
import navbar from "@/components/navBar.vue";
import { mapState } from "vuex";
export default {
  name: "App",
  data() {
    return {};
  },
  computed: {
    ...mapState(["tabHidden"])
  },
  components: {
    navbar
  }
};
</script>

<style>
@import "assets/icon/iconfont.css";
* {
  margin: 0;
  padding: 0;
}
.app {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  /* background-color: #f0eff4; */
}
</style>
