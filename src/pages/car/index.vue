<template>
  <transition name="fade">
    <div class="wrapper">
      <div class="carsTitle">
        <span class="iconfont icon-return-solid" @click="goBack"></span>
        所有汽车
      </div>
      <ul
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        :infinite-scroll-immediate-check="true"
        infinite-scroll-distance="10"
        class="carContent"
      >
        <li v-for="(item,index) in carList" :key="index" @click="goDetail(item.id)">
          <img :src="item.apperanceImage" alt>
          <div>
            <p class="carName">{{item.name}}</p>
            <p class="carPrice">{{item.originlfTime}}</p>
            <p class="carPrice activeColor">{{item.price}}万</p>
          </div>
        </li>
      </ul>
      <div class="loading-box" v-if="isLoading">
        <mt-spinner type="triple-bounce" :size="20"></mt-spinner>
      </div>
      <div class="sigma-content" v-if="noMore">
        <div class="sigma-middle-line">
          <span class="sigma-line-text">没有更多数据啦!</span>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import defaultUrl from "@/common/util.js";
const url = defaultUrl.defaultUrl;
export default {
  data() {
    return {
      pageInfo: {
        index: 1,
        size: 15,
        //总条数
        total: 0,
        //分页数
        totalPage: 1
      },
      //显示没有数据
      noMore: false,
      //加载更多
      loading: false,
      //显示加载图标
      isLoading: false,
      carList: []
    };
  },
  created() {
    if (this.$store.state.tabHidden) {
      this.$store.commit("change");
    }
    //从类别进入
    if (this.$route.query.from === "category") {
      if (
        this.$route.query.isExistParams === true ||
        this.$route.query.isExistParams === "true"
      ) {
        this.loadData(this.$route.query);
      } else {
        this.loadData(this.$route.query);
      }
    }
    //从首页进入
    if (this.$route.query.from === "home") {
      this.loadData(this.$route.query);
    }
  },
  methods: {
    //加载数据
    loadData(param) {
      if (param.from === "category") {
        if (param.isExistParams) {
          var carParams = {
            isId: true,
            brandId: this.$route.query.brandId,
            seriesId: this.$route.query.seriesId,
            pageSize: this.pageInfo.size,
            pageNumber: this.pageInfo.index
          };
        } else {
          var carParams = {
            isId: false,
            pageSize: this.pageInfo.size,
            pageNumber: this.pageInfo.index
          };
        }
        this.$http
          .get(url + "/cars", {
            params: carParams
          })
          .then(res => {
            if (res.data.code == 100) {
              if (res.data.data.length > 0) {
                this.pageInfo.total = res.data.data[0].total;
                this.pageInfo.totalPage = Math.ceil(
                  this.pageInfo.total / this.pageInfo.size
                );
                res.data.data.forEach(item => {
                  item.apperanceImage = url + item.apperanceImage;
                });
                this.carList.push(...res.data.data);
                this.loading = false;
                this.isLoading = false;
              }
            }
          });
      }
      if (param.from === "home") {
        this.$http
          .get(url + "/column", {
            params: {
              columnId: param.columnId,
              pageSize: this.pageInfo.size,
              pageNumber: this.pageInfo.index
            }
          })
          .then(res => {
            if (res.data.code == 100) {
              if (res.data.data.length > 0) {
                this.pageInfo.total = res.data.data[0].total;
                this.pageInfo.totalPage = Math.ceil(
                  this.pageInfo.total / this.pageInfo.size
                );
                res.data.data.forEach(item => {
                  item.apperanceImage = url + item.apperanceImage;
                });
                this.carList.push(...res.data.data);
                this.loading = false;
                this.isLoading = false;
              }
            }
          });
      }
    },
    loadMore() {
      this.pageInfo.index++;
      this.loading = true;
      this.isLoading = true;
      if (this.pageInfo.index > this.pageInfo.totalPage) {
        this.isLoading = false;
        this.noMore = true;
        return;
      }
      let param = this.$route.query;
      setTimeout(() => {
        this.loadData(param);
      }, 1500);
    },
    goDetail(e) {
      this.$router.push({
        path: "/detail",
        query: { carId: e }
      });
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style>
.wrapper {
  width: 100%;
  height: 100%;
  padding-top: 8vh;
  position: absolute;
  overflow-y: scroll;
  top: 0;
  left: 0;
  background-color: #f0eff4;
}
.fade-enter-active,
.fade-leave-active {
  transition: transform 0.5s;
  opacity: 1;
}
.fade-enter,
.fade-leave-active {
  transform: translate3d(0, 100%, 0);
  opacity: 1;
}
.carsTitle {
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 8vh;
  display: flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  justify-content: center;
  background-color: #fff;
}
.icon-return-solid {
  position: absolute;
  left: 20px;
  font-size: 25px;
}
.carContent {
  box-sizing: border-box;
}
.carContent > li {
  height: 15.5vh;
  list-style: none;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  background-color: #fff;
  margin: 10px;
}
.carContent > li > img {
  width: 30vw;
  margin: 0 2vw;
}
.carContent > li > div > p:first-child {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.carContent > li > div {
  width: calc(100% - 34vw);
}
.loading-box {
  display: flex;
  justify-content: center;
}
.mint-spinner-triple-bounce {
  width: 50px;
}
.sigma-content {
  margin: 0 10px;
  text-align: center;
}
.sigma-middle-line:before {
  content: "";
  display: block;
  height: 1px;
  width: 100%;
  background-color: #999; /*颜色需与主题大背景色一致*/
  position: relative;
  top: 12px; /*调节线高*/
  left: 0;
}
.sigma-line-text {
  display: inline-block;
  background: #f0eff4;
  padding: 0 18px 0 18px;
  position: relative;
  font-size: 14px;
}
.carName {
  font-size: 14px;
}
.carPrice {
  font-size: 13px;
}
.activeColor {
  color: #d13134;
}
</style>


