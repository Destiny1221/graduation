<template>
  <div>
    <div class="mineContent">
      <div class="unLogin" @click="goLogin">
        <img src="../../assets/image/default.png" alt>
        <span v-if="userName">{{userName}}</span>
        <span v-else>点击登录</span>
      </div>
      <div @click="goUpdate">
        修改个人信息
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userName: ""
    };
  },
  created() {
    if (!this.$store.state.tabHidden) {
      this.$store.commit("change");
    }
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      this.userName = userInfo.userName;
    }
  },
  methods: {
    goLogin() {
      this.$router.push({
        path: "/login",
        query: { from: this.$route.fullPath }
      });
    },
    goUpdate(){
      // this.$http.
    }
  }
};
</script>
<style>
.mineContent {
  display: flex;
  flex-direction: column;
}
.unLogin {
  display: flex;
  height: 10vh;
  align-items: center;
  box-sizing: border-box;
  background-color: #fff;
}
.unLogin > img {
  height: 60%;
  margin: 0 20px;
}
.unLogin > span {
  font-size: 14px;
}
</style>


