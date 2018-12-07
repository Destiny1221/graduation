<template>
  <div v-if="car" class="carDetailWrapper">
    <img-scale v-if="showImg" @clickIt="viewImg" :imgSrc="imgSrc"></img-scale>
    <span class="iconfont icon-back detailBack" @click="goBack"></span>
    <img class="pic" :src="car.apperanceImage" @click="showImage(car.apperanceImage)">
    <p class="detailName">{{car.name}}</p>
    <p class="detailName">{{car.price}}万</p>
    <div class="carDA">
      <div></div>车辆档案
    </div>
    <div class="detailButton">
      <div @click="active='basic'" :class="{actived:active=='basic'}">基本信息</div>
      <div @click="active='body'" :class="{actived:active=='body'}">车身参数</div>
      <div @click="active='engine'" :class="{actived:active=='engine'}">发动机参数</div>
    </div>
    <mt-tab-container v-model="active" :swipeable="true">
      <mt-tab-container-item id="basic">
        <div class="carDetail">
          <span>上市时间</span>
          <span>{{car.originlfTime}}</span>
        </div>
        <div class="carDetail">
          <span>最高车速(km/h)</span>
          <span>{{car.maxSpeed}}</span>
        </div>
        <div class="carDetail">
          <span>百里加速度</span>
          <span>{{car.speedTime}}</span>
        </div>
        <div class="carDetail">
          <span>车辆颜色</span>
          <span>{{car.color}}</span>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="body">
        <div class="carDetail">
          <span>长(mm)</span>
          <span>{{car.length}}</span>
        </div>
        <div class="carDetail">
          <span>宽(mm)</span>
          <span>{{car.width}}</span>
        </div>
        <div class="carDetail">
          <span>高(mm)</span>
          <span>{{car.height}}</span>
        </div>
        <div class="carDetail">
          <span>轴距(mm)</span>
          <span>{{car.wheelBase}}</span>
        </div>
        <div class="carDetail">
          <span>车门数</span>
          <span>{{car.doorNum}}</span>
        </div>
        <div class="carDetail">
          <span>座椅数</span>
          <span>{{car.seatNum}}</span>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="engine">
        <div class="carDetail">
          <span>排气量(mL)</span>
          <span>{{car.dischargeRate}}</span>
        </div>
        <div class="carDetail">
          <span>发动机类型</span>
          <span>{{car.engineType}}</span>
        </div>
        <div class="carDetail">
          <span>气缸数</span>
          <span>{{car.cylinderNum}}</span>
        </div>
        <div class="carDetail">
          <span>最大马力(Ps)</span>
          <span>{{car.maxPs}}</span>
        </div>
        <div class="carDetail">
          <span>最大功率(kW)</span>
          <span>{{car.maxPower}}</span>
        </div>
        <div class="carDetail">
          <span>最大功率转速(rpm)</span>
          <span>{{car.maxPowerSpeed}}</span>
        </div>
        <div class="carDetail">
          <span>最大扭矩(N.m)</span>
          <span>{{car.maxNm}}</span>
        </div>
        <div class="carDetail">
          <span>最大扭矩转速(rpm)</span>
          <span>{{car.maxNmSpeed}}</span>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
    <div class="selectOption">
      <div @click="goCollect">
        <img v-if="!isCollect" src="../../assets/image/unChecked.png" alt>
        <img v-else src="../../assets/image/checked.png" alt>
      </div>
      <div @click="goAppointment">预约试驾</div>
    </div>
  </div>
</template>
<script>
import imgScale from "@/components/imgScale.vue";
import defaultUrl from "@/common/util.js";
const url = defaultUrl.defaultUrl;
export default {
  data() {
    return {
      active: "basic",
      car: null,
      imgSrc: "",
      showImg: false,
      isCollect: false
    };
  },
  created() {
    if (this.$store.state.tabHidden) {
      this.$store.commit("change");
    }
    this.queryCarDetail(this.$route.query.carId);
  },
  methods: {
    //查询汽车详情
    queryCarDetail(id) {
      this.$http
        .get(url + "/cars/detail", { params: { carsId: id } })
        .then(res => {
          if (res.data.code == 100) {
            res.data.data.forEach(item => {
              if (item.apperanceImage) {
                item.apperanceImage = url + item.apperanceImage;
              }
            });
            this.car = res.data.data[0];
            //将汽车详情保存至本地
            localStorage.setItem("carDetail", JSON.stringify(this.car));
          }
        });
    },
    showImage(e) {
      this.imgSrc = e;
      this.showImg = true;
    },
    viewImg() {
      this.showImg = false;
    },
    goBack() {
      this.$router.go(-1);
    },
    //预约试驾
    goAppointment() {
      this.$router.push({
        path: "/appointment"
      });
    },
    goCollect() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo) {
        if (!this.isCollect) {
          this.$http
            .post(url + "/cars/collect", {
              carId: this.car.id,
              userId: userInfo.id
            })
            .then(res => {
              if (res.data.code == 100) {
                this.isCollect = !this.isCollect;
                this.$toast({
                  message: "收藏成功"
                });
              }
            });
        } else {
          this.$http
            .post(url + "/cars/collect/cancel", {
              carId: this.car.id
            })
            .then(res => {
              if (res.data.code == 100) {
                this.isCollect = !this.isCollect;
                this.$toast({
                  message: "取消收藏"
                });
              }
            });
        }
      } else {
        this.$router.push({
          path: "/login",
          query: { isBack: true, carId: this.$route.query.carId }
        });
      }
    }
  },
  components: {
    "img-scale": imgScale
  }
};
</script>
<style>
.carDetailWrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: scroll;
  background-color: #f0eff4;
}
.detailBack {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 20px;
}
.detailName {
  line-height: 30px;
  font-size: 14px;
  background-color: #fff;
  box-sizing: border-box;
  padding-left: 20px;
}
.pic {
  width: 100%;
  margin-bottom: 10px;
}
.carDA {
  height: 50px;
  line-height: 50px;
  background-color: #fff;
  margin-top: 10px;
  box-sizing: border-box;
  padding-left: 20px;
  position: relative;
  font-size: 15px;
}
.carDA > div {
  height: 100%;
  width: 5px;
  background-color: #d13134;
  position: absolute;
  left: 0;
  top: 0;
}
.detailButton {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  background-color: rgb(200, 200, 200);
}
.detailButton > div {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 14px;
}
.carDetail {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  font-size: 13px;
  border-bottom: 1px solid #e9e9e9;
  padding: 0 10px;
}
.actived {
  background-color: #d13134;
  color: #fff;
}
.mint-tab-container {
  margin-bottom: 8vh;
}
.selectOption {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  height: 8vh;
  background-color: #fff;
  display: flex;
  align-items: center;
}
.selectOption > div {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.selectOption > div:last-child {
  background-color: #d13134;
  color: #fff;
  font-size: 14px;
}
.selectOption > div > img {
  width: 25px;
}
</style>


