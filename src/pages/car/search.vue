<template>
  <div class="searchContent">
    <div class="searchTop">
      <span
        class="iconfont icon-back"
        style="font-size:18px;
      margin-left:10px"
        @click="goBack"
      ></span>
      <div class="searchInput">
        <span class="iconfont icon-search"></span>
        <input type="text" placeholder="请输入车名" v-model="keyWords">
        <span class="iconfont icon-xianshi_quxiaotianchong" @click="cancelSearch" v-if="isInput"></span>
      </div>
      <span class="searchCancel" @click="goSearch">搜索</span>
    </div>
    <div class="searchView" v-if="!showContent">
      <div class="lastSearch">
        <span style="font-size:13px">最近搜索</span>
        <span class="iconfont icon-shanchu" @click="deleteSearch" v-if="historyList.length>0"></span>
      </div>
      <div class="lastSearchContent" ref="content">
        <div class="noSearchData" v-if="historyList.length==0">无搜索历史记录</div>
        <div
          v-else
          class="lastSearchView"
          v-for="(item,index) in historyList"
          :key="index"
          @click="goSelect(item)"
        >{{item}}</div>
      </div>
      <div class="lastSearch" style="margin-bottom:15px">
        <span style="font-size:13px">热门搜索</span>
        <div class="change" @click="goChange">
          <span class="iconfont icon-huanyihuan"></span>
          <span>换一换</span>
        </div>
      </div>
      <div class="lastSearchContent">
        <div
          class="lastSearchView"
          v-for="(item,index) in showHoteSearch"
          :key="index"
          @click="goSelect(item.content)"
        >{{item.content}}</div>
      </div>
    </div>
    <div
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      :infinite-scroll-immediate-check="true"
      infinite-scroll-distance="10"
      v-else
    >
      <div
        v-for="(item,index) in carList"
        :key="index"
        class="searchCar"
        @click="goDetail(item.id)"
      >
        <img :src="item.apperanceImage" alt>
        <div>
          <p class="searchName">{{item.name}}</p>
          <p class="searchPrice">{{item.originlfTime}}</p>
          <p class="searchPrice activeColor">{{item.price}}万</p>
        </div>
      </div>
    </div>
    <div class="loading-box" v-if="isLoading">
      <mt-spinner type="triple-bounce" :size="20"></mt-spinner>
    </div>
  </div>
</template>
<script>
import defaultUrl from "@/common/util.js";
const url = defaultUrl.defaultUrl;
export default {
  data() {
    return {
      keyWords: "",
      //全部热搜数组
      hotSearch: [],
      //展示热搜数组
      showHoteSearch: [],
      pageInfo: {
        index: 1,
        size: 15,
        //总条数
        total: 0,
        //分页数
        totalPage: 1
        // searchContent:window.getComputedStyle(this.$refs.content).height
      },
      //加载更多
      loading: false,
      //显示加载图标
      isLoading: false,
      //是否显示搜索内容
      showContent: false,
      carList: [],
      //历史搜索记录
      historyList: []
    };
  },
  computed: {
    isInput() {
      if (this.keyWords) {
        return true;
      } else {
        return false;
      }
    }
  },
  async created() {
    if (this.$store.state.tabHidden) {
      this.$store.commit("change");
    }
    //获取本地搜索记录
    let list = JSON.parse(localStorage.getItem("historyList"));
    if (list && list.length > 0) {
      this.historyList = list;
    }
    //获取热搜
    await this.$http.get(url + "/ad/hotSearch").then(res => {
      if (res.data.code == 100) {
        if (res.data.data) {
          this.hotSearch.push(...res.data.data);
        }
      }
    });
    this.showHoteSearch = this.getRandomArrayElements(this.hotSearch, 4);
  },
  mounted() {
    console.log(window.getComputedStyle(this.$refs.content).height);
  },
  methods: {
    goChange() {
      this.showHoteSearch = this.getRandomArrayElements(this.hotSearch, 4);
    },
    //随机从数组中截取固定长度的数组
    getRandomArrayElements(arr, count) {
      var shuffled = arr.slice(0),
        i = arr.length,
        min = i - count,
        temp,
        index;
      while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
      }
      return shuffled.slice(min);
    },
    goSearch() {
      this.showContent = true;
      this.carList = [];
      this.searchCars(this.keyWords, "click");
      //将搜索保存在本地
      let list = JSON.parse(localStorage.getItem("historyList"));
      if (this.keyWords.replace(/(^\s*)|(\s*$)/g, "")) {
        if (list && list.length > 0) {
          if (list.indexOf(this.keyWords) == -1) {
            list.unshift(this.keyWords);
            localStorage.setItem("historyList", JSON.stringify(list));
          } else {
            let index = list.findIndex(item => item == this.keyWords);
            list.splice(index, 1);
            list.unshift(this.keyWords);
            localStorage.setItem("historyList", JSON.stringify(list));
          }
        } else {
          this.historyList.unshift(this.keyWords);
          localStorage.setItem("historyList", JSON.stringify(this.historyList));
        }
      }
    },
    searchCars(keyWords, type) {
      //判断是否为点击
      if (type === "click") {
        this.pageInfo.index = 1;
      }
      this.$http
        .get(url + "/cars/search", {
          params: {
            keywords: keyWords,
            pageNumber: this.pageInfo.index,
            pageSize: this.pageInfo.size
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
    },
    loadMore() {
      this.pageInfo.index++;
      this.loading = true;
      this.isLoading = true;
      if (this.pageInfo.index > this.pageInfo.totalPage) {
        this.isLoading = false;
        return;
      }
      let keywords = this.keyWords;
      setTimeout(() => {
        this.searchCars(keywords, "load");
      }, 1500);
    },
    goDetail(e) {
      this.$router.push({
        path: "/detail",
        query: { carId: e }
      });
    },
    goSelect(e) {
      this.keyWords = e;
    },
    //删除最近搜索
    deleteSearch() {
      this.historyList = [];
      localStorage.removeItem("historyList");
    },
    cancelSearch() {
      this.showContent = false;
      this.keyWords = "";
      let list = JSON.parse(localStorage.getItem("historyList"));
      if (list) {
        this.historyList = list;
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  },
  watch: {
    keyWords(val) {
      if (val.replace(/\s*/g, "")) {
      } else {
        this.showContent = false;
        let list = JSON.parse(localStorage.getItem("historyList"));
        if (list) {
          this.historyList = list;
        }
      }
    }
  }
};
</script>
<style>
.searchContent {
  background-color: #fff;
  position: absolute;
  width: 100%;
  height: 100%;
}
.searchTop {
  height: 10vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.searchCancel {
  margin-right: 10px;
  font-size: 14px;
  color: #d13134;
}
.searchInput {
  flex: 1;
  margin: 0 10px;
  position: relative;
  height: 7vw;
  border-radius: 3.5vw;
  display: flex;
  align-items: center;
  border: 1px solid #e9e9e9;
}
.searchInput > span {
  margin: 0 2vw 0 3vw;
}
.searchInput > input {
  flex: 1;
  border: 0;
  outline: none;
  font-size: 13px;
}
.icon-xianshi_quxiaotianchong {
  color: #ccc;
  font-size: 16px;
}
.searchView {
  margin: 0 10px;
}
.lastSearch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30px;
}
.lastSearchContent {
  /* height: 68px; */
  overflow: hidden;
}
.lastSearchView {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 40px;
  border: 1px solid #d13134;
  color: #d13134;
  font-size: 12px;
  margin-right: 5px;
  margin-bottom: 5px;
  white-space: nomarl;
  word-break: break-all;
}
.noSearchData {
  font-size: 12px;
  color: #999;
}
.searchCar {
  background-color: #fff;
  height: 15.5vh;
  display: flex;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
}
.searchCar > img {
  width: 30vw;
  margin: 0 2vw;
}
.searchName {
  font-size: 14px;
}
.searchPrice {
  font-size: 13px;
}
.activeColor {
  color: #d13134;
}
.loading-box {
  display: flex;
  justify-content: center;
}
.mint-spinner-triple-bounce {
  width: 50px;
}
.change > span:last-child {
  font-size: 13px;
}
</style>

