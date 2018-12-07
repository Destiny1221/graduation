<template>
  <div v-if="brand.length>0" class="category">
    <comman-header title="类别"></comman-header>
    <div class="categoryContent">
      <div class="categoryView">
        <div class="brandChart">★</div>
        <div class="brandName" @click="goCars">不限品牌</div>
      </div>
      <div v-for="items in brand" :key="items.index" class="categoryView">
        <div class="brandChart">{{items.index}}</div>
        <div
          v-for="item in items.content"
          :key="item.id"
          class="brandName"
          @click="selectBrand(item)"
        >
          <img :src="item.logo" alt>
          <span>{{item.brandName}}</span>
        </div>
      </div>
    </div>
    <mt-popup v-model="popupVisible" position="right" v-if="seriesArry.length>0">
      <series :series="seriesArry" :brandInfo="brandInfo"></series>
    </mt-popup>
  </div>
</template>
<script>
import commonHeader from "@/components/header.vue";
import series from "./series.vue";
import defaultUrl from "@/common/util.js";
const url = defaultUrl.defaultUrl;
export default {
  data() {
    return {
      brand: [],
      seriesArry: [],
      brandInfo: null,
      popupVisible: false
    };
  },
  created() {
    if (!this.$store.state.tabHidden) {
      this.$store.commit("change");
    }
    //获取品牌数据
    this.getBrand();
  },
  methods: {
    //获取汽车品牌
    async getBrand() {
      this.$indicator.open("加载中...");
      await this.$http.get(url + "/brand").then(res => {
        let result = res.data;
        if (result.code == 100) {
          let brandResult = result.data;
          brandResult.forEach(item => {
            if (item.logo) {
              item.brandImage = url + item.brandImage;
              item.logo = url + item.logo;
            }
          });
          var objA = {};
          var objB = {};
          var objK = {};
          var objL = {};
          var objX = {};
          for (let item of brandResult) {
            if (item.findIndex == "A") {
              this.changeObj(objA, "A", item);
            }
            if (item.findIndex == "B") {
              this.changeObj(objB, "B", item);
            }
            if (item.findIndex == "K") {
              this.changeObj(objK, "K", item);
            }
            if (item.findIndex == "L") {
              this.changeObj(objL, "L", item);
            }
            if (item.findIndex == "X") {
              this.changeObj(objX, "X", item);
            }
          }
          this.brand.push(objA);
          this.brand.push(objB);
          this.brand.push(objK);
          this.brand.push(objL);
          this.brand.push(objX);
        }
      });
      this.$indicator.close();
    },
    //改变结构
    changeObj(obj, chart, item) {
      obj.index = chart;
      if (Array.isArray(obj.content)) {
        obj.content.push(item);
      } else {
        obj.content = [];
        obj.content.push(item);
      }
    },
    //根据品牌id获取车辆系列
    selectBrand(e) {
      this.$http
        .get(url + "/series", {
          params: {
            brandId: e.id
          }
        })
        .then(res => {
          if (res.data.code == 100) {
            this.popupVisible = true;
            this.brandInfo = e;
            res.data.data.forEach(item => {
              item.seriesLogo = url + item.seriesLogo;
            });
            this.seriesArry = [];
            this.seriesArry.push(...res.data.data);
          }
        });
    },
    goCars() {
      this.$router.push({
        path: "/cars",
        query: { isExistParams: false, from: "category" }
      });
    }
  },
  components: { "comman-header": commonHeader, series }
};
</script>
<style>
.category {
  margin-bottom: 10vh;
  background-color: #f0eff4;
}
.categoryContent {
  margin-top: 8vh;
}
.categoryView {
  background-color: #fff;
  margin-bottom: 10px;
}
.brandChart,
.brandName {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border-bottom: 1px solid #e9e9e9;
}
.brandChart {
  height: 5vh;
  padding-left: 10px;
  font-size: 14px;
}
.brandName {
  height: 8vh;
  padding-left: 15px;
  font-size: 12px;
  display: flex;
  align-items: center;
}
.brandName > img {
  height: 80%;
}
.brandName > span {
  margin-left: 15px;
}
.mint-popup-right {
  width: 80%;
  height: 100%;
}
</style>


