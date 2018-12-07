<template>
  <div class="seriesContent">
    <div class="seriesTitle">品牌导航</div>
    <div class="seriesBrand">
      <img :src="brandInfo.logo">
      <span>{{brandInfo.brandName}}</span>
    </div>
    <div style="height:8px;background-color:#f0eff4"></div>
    <div class="brandChart" style="border-bottom:1px solid rgb(230, 230, 230)">★</div>
    <div
      class="brandName"
      style="border-bottom:1px solid rgb(230, 230, 230)"
      @click="goCars('brand',brandInfo.id)"
    >不限车系</div>
    <div
      v-for="(item,index) in series"
      :key="index"
      class="series"
      @click="goCars('series',item.id)"
    >
      <img :src="item.seriesLogo">
      <span>{{item.seriesName}}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: { series: Array, brandInfo: Object },
  methods: {
    //跳转去汽车
    goCars(type, e) {
      if (type == "brand") {
        this.$router.push({
          path: "/cars",
          query: {
            brandId: e,
            seriesId: "",
            isExistParams: true,
            from: "category"
          }
        });
      } else {
        this.$router.push({
          path: "/cars",
          query: {
            brandId: "",
            seriesId: e,
            isExistParams: true,
            from: "category"
          }
        });
      }
    }
  }
};
</script>
<style>
.seriesContent {
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow-y: scroll;
}
.seriesTitle {
  height: 8vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-sizing: border-box;
  border-bottom: 1px solid #e9e9e9;
}
.seriesBrand {
  display: flex;
  align-items: center;
  height: 8vh;
}
.seriesBrand > img,
.series > img {
  height: 90%;
  margin: 0 15px;
}
.seriesBrand > span {
  font-size: 13px;
}
.series {
  display: flex;
  align-items: center;
  height: 8vh;
  box-sizing: border-box;
  border-bottom: 1px solid #e9e9e9;
}
.series > span {
  font-size: 13px;
}
</style>


