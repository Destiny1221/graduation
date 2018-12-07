<template>
  <div>
    <comman-header title="我的预约"></comman-header>
    <div class="listContent">
      <div class="list" v-for="(item,index) in list" :key="index">
        <img :src="item.apperanceImage" alt>
        <div class="listInfo">
          <span>{{item.name}}</span>
          <span>{{item.color}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import commonHeader from "@/components/header.vue";
import defaultUrl from "@/common/util.js";
const url = defaultUrl.defaultUrl;
export default {
  data() {
    return {
      userInfo: null,
      list: []
    };
  },
  created() {
    if (!this.$store.state.tabHidden) {
      this.$store.commit("change");
    }
    let users = JSON.parse(localStorage.getItem("userInfo"));
    if (users) {
      this.userInfo = users;
    }
    this.getList();
  },
  methods: {
    //获取预约单
    getList() {
      this.$http
        .get(url + "/appointment", {
          params: { userId: this.userInfo.id }
        })
        .then(res => {
          if (res.data.code == 100) {
            if (res.data.data && res.data.data.length > 0) {
              res.data.data.forEach(item => {
                item.apperanceImage = url + item.apperanceImage;
              });
              this.list.push(...res.data.data);
            }
          }
        });
    }
  },
  components: { "comman-header": commonHeader }
};
</script>
<style>
.listContent {
  position: absolute;
  top: 8vh;
  bottom: 10vh;
  left: 0;
  right: 0;
  overflow-y: scroll;
  background-color: #f0eff4;
}
.list {
  height: 15vh;
  display: flex;
  align-items: center;
  margin: 15px;
  background-color: #fff;
}
.list > img {
  margin: 0 15px;
}
.box {
  width: 20px;
  height: 20px;
}
.box > input {
  display: none;
}
.list > img {
  height: 60%;
  display: block;
}
.listInfo {
  display: flex;
  flex-direction: column;
}
.listInfo > span {
  font-size: 14px;
}
.cancelContent {
  position: fixed;
  left: 15px;
  right: 15px;
  bottom: 10vh;
  height: 8vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
}
.cancelContent > div {
  display: flex;
}
</style>


