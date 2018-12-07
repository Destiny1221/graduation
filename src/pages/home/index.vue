<template>
  <div class="homeContent">
    <div class="homeTop">
      <div class="ad">
        <mt-swipe ref="swipe" :auto="4000" :showIndicators="false">
          <mt-swipe-item v-for="(img, index) in adImgSrc" :key="index">
            <img class="img" :src="img.imgSrc" alt @click="goDetail(img.carId)">
          </mt-swipe-item>
        </mt-swipe>
      </div>
      <div class="search" @click="goSearch">
        <span class="iconfont icon-search" style="color:#d13134"></span>
        <input type="text" value="请输入车名" disabled>
      </div>
    </div>
    <div class="homeContents">
      <div v-for="item in temporary.column" :key="item.id">
        <div class="homeTitle" @click="goMore(item.id)">
          <span>{{item.name}}</span>
          <div>
            <span>更多</span>
            <span class="iconfont icon-iconmore" style="font-size:13px"></span>
          </div>
        </div>
        <div class="homeView">
          <div v-for="carItem in item.showContent" :key="carItem.id" @click="goDetail(carItem.id)">
            <img :src="carItem.apperanceImage" alt>
            <p class="homeViewName">{{carItem.name}}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- <img ref="img" src="@/assets/image/3.jpg" @click="showColor"> -->
  </div>
</template>
<script>
import defaultUrl from "@/common/util.js";
const url = defaultUrl.defaultUrl;
export default {
  data() {
    return {
      adImgSrc: [],
      topColor: [],
      swipe: null,
      temporary: {
        column: [],
        cars: []
      }
    };
  },
  created() {
    if (!this.$store.state.tabHidden) {
      this.$store.commit("change");
    }
  },
  watch: {
    "swipe.index": function(nv) {
      let top = document.querySelector(".homeTop");
      top.style.backgroundColor = this.topColor[nv];
    }
  },
  mounted() {
    this.swipe = this.$refs.swipe;
    this.getHomeAd();
    this.getData();
  },
  methods: {
    //获取首页轮播数据
    getHomeAd() {
      this.$http.get(url + "/ad").then(res => {
        let result = res.data;
        if (result.code == 100) {
          result.data.forEach(item => {
            item.imgSrc = url + item.imgSrc;
            this.topColor.push(item.background);
          });
          this.adImgSrc.push(...result.data);
        }
      });
    },
    //合并数据
    async getData() {
      try {
        //获取首页栏目
        await this.$http.get(url + "/column").then(res => {
          let result = res.data;
          if (result.code == 100) {
            this.temporary.column.push(...result.data);
          }
        });
        //获取所有汽车
        await this.$http.get(url + "/cars/all").then(res => {
          let result = res.data;
          if (result.code == 100) {
            this.temporary.cars.push(...result.data);
          }
        });
        this.temporary.column.forEach(item => {
          this.$set(item, "content", []);
          this.$set(item, "showContent", []);
          this.temporary.cars.forEach(carItem => {
            if (item.id == carItem.columnId) {
              carItem.apperanceImage = url + carItem.apperanceImage;
              item.content.push(carItem);
              if (item.showContent.length < 6) {
                item.showContent.push(carItem);
              }
            }
          });
        });
      } catch (err) {
        console.log(err);
      }
    },
    goMore(e) {
      this.$router.push({
        path: "/cars",
        query: {
          from: "home",
          columnId: e
        }
      });
    },
    goDetail(e) {
      this.$router.push({
        path: "/detail",
        query: { carId: e }
      });
    },
    goSearch() {
      this.$router.push({ path: "/search" });
    },
    //获取图片主题色
    showColor() {
      RGBaster.colors(this.$refs.img, {
        exclude: ["rgb(255,255,255)", "rgb(0,0,0)"],
        success: function(payload) {
          console.log(payload.dominant);
        }
      });
    }
  }
};
</script>
<style>
.homeContent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 10vh;
  background-color: #fff;
  overflow-y: scroll;
}
.homeTop {
  height: 48vw;
  background-color: rgb(191, 175, 162);
  position: relative;
}
.ad {
  position: absolute;
  height: 50.625vw;
  top: 16vw;
  left: 5vw;
  right: 5vw;
  border-radius: 8px;
}
.mint-swipe,
.mint-swipe-items-wrap,
.mint-swipe-item {
  border-radius: 8px;
}
.img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}
.is-active {
  background-color: #dbb232 !important;
}
.mint-swipe-indicator {
  opacity: 1;
}
.homeContents {
  margin: 18.625vw 0 0 0;
}
.homeContents > div {
  padding: 10px 0 0 0;
}
.search {
  position: absolute;
  top: 4.5vw;
  width: 80%;
  height: 7vw;
  left: 10%;
  border-radius: 3.5vw;
  display: flex;
  align-items: center;
  background-color: #fff;
}
.search > input {
  border: 0;
  border-radius: 3.5vw;
  background-color: #fff;
  flex: 1;
  height: 100%;
  font-size: 13px;
}
.search > span {
  margin: 0 2vw 0 3vw;
}
.homeTitle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 5vh;
  font-size: 13px;
  background-color: rgba(209, 49, 52, 0.1);
  box-sizing: border-box;
  padding: 0 5vw;
}
.homeView {
  display: flex;
  flex-wrap: wrap;
  margin: 0 5vw;
}
.homeView > div {
  width: 33%;
  padding: 5px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.homeView > div > img {
  width: 100%;
}
.homeViewName {
  width: 100%;
  overflow: hidden; /*自动隐藏文字*/
  text-overflow: ellipsis; /*文字隐藏后添加省略号*/
  white-space: nowrap;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
}
</style>


