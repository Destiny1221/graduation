<template>
  <transition name="fade">
    <div class="loginContent">
      <div class="loginTop">
        <img src="../../assets/image/login.jpg" alt>
        <div class="loginWord">
          <div :class="{loginActived:isLogin}" @click="isLogin=true">sign in</div>
          <div :class="{loginActived:!isLogin}" @click="isLogin=false">sign up</div>
        </div>
        <span class="iconfont icon-back loginBack" @click="goReturn"></span>
      </div>
      <template v-if="isLogin">
        <mt-field
          label="手机号"
          :state="isTrue"
          type="tel"
          v-model="userPhone"
          :disableClear="true"
          :attr="{maxlength:11}"
        ></mt-field>
        <mt-field label="密码" type="password" v-model="userPwd" :disableClear="true"></mt-field>
        <div class="loginButton" :class="isActive" @click="goLogin">登录</div>
      </template>
      <template v-else>
        <mt-field label="用户名" v-model="userName" :disableClear="true"></mt-field>
        <mt-field
          label="手机号"
          :state="isRegisterTrue"
          type="tel"
          v-model="registerUserPhone"
          :disableClear="true"
          :attr="{maxlength:11}"
        ></mt-field>
        <mt-field label="密码" type="password" v-model="registerUserPwd" :disableClear="true"></mt-field>
        <div class="loginButton" :class="isRegisterActive" @click="goRegister">新用户注册</div>
      </template>
      <!-- <ul class="login-types">
        <li class="login-item">
          <img src="../../assets/image/qq.png" alt>
          <p class="title">QQ</p>
        </li>
        <li class="login-item">
          <img src="../../assets/image/wechat.png" alt>
          <p class="title">微信</p>
        </li>
        <li class="login-item">
          <img src="../../assets/image/alipay.png" alt>
          <p class="title">支付宝</p>
        </li>
        <li class="login-item">
          <img src="../../assets/image/blog.png" alt>
          <p class="title">新浪微博</p>
        </li>
      </ul>-->
    </div>
  </transition>
</template>
<script>
import defaultUrl from "@/common/util.js";
const url = defaultUrl.defaultUrl;
export default {
  data() {
    return {
      isLogin: true,
      userPhone: "",
      userPwd: "",
      userName: "",
      registerUserPhone: "",
      registerUserPwd: ""
    };
  },
  created() {
    if (this.$store.state.tabHidden) {
      this.$store.commit("change");
    }
  },
  computed: {
    isActive() {
      if (this.userPhone && this.userPwd) {
        return "actived";
      } else {
        return "unactived";
      }
    },
    isRegisterActive() {
      if (this.userName && this.registerUserPhone && this.registerUserPwd) {
        return "actived";
      } else {
        return "unactived";
      }
    },
    isTrue() {
      let phone = /^1[1|3|4|5|7|8][0-9]{9}$/;
      if (this.userPhone.replace(/(^s*)|(s*$)/g, "").length > 0) {
        if (phone.test(this.userPhone)) {
          return "success";
        } else {
          return "error";
        }
      }
    },
    isRegisterTrue() {
      let phone = /^1[1|3|4|5|7|8][0-9]{9}$/;
      if (this.registerUserPhone.replace(/(^s*)|(s*$)/g, "").length > 0) {
        if (phone.test(this.registerUserPhone)) {
          return "success";
        } else {
          return "error";
        }
      }
    }
  },
  methods: {
    goLogin() {
      if (/^1[1|3|4|5|7|8][0-9]{9}$/.test(this.userPhone)) {
        this.getUserInfo(this.userPhone, this.userPwd, true);
      } else {
        this.$toast({
          message: "手机号码格式有误",
          duration: 5000
        });
      }
    },
    //注册
    goRegister() {
      if (
        this.userName.replace(/(^s*)|(s*$)/g, "").length > 0 &&
        this.registerUserPhone.replace(/(^s*)|(s*$)/g, "").length > 0 &&
        this.registerUserPwd.replace(/(^s*)|(s*$)/g, "").length > 0
      ) {
        this.$http
          .post(url + "/users/register", {
            userName: this.userName,
            userPhone: this.registerUserPhone,
            userPwd: this.registerUserPwd
          })
          .then(res => {
            if (res.data.code == 100) {
              this.getUserInfo(
                this.registerUserPhone,
                this.registerUserPwd,
                false
              );
              this.$toast({
                message: "注册成功!",
                iconClass: "iconfont icon-chenggong",
                duration: 3000
              });
              setTimeout(() => {
                if (this.$route.query.isBack) {
                  this.$router.push({
                    path: "/detail",
                    query: {
                      carId: this.$route.query.carId
                    }
                  });
                } else {
                  this.$router.push({ path: this.$route.query.from });
                }
              }, 3000);
            }
            if (res.data.code == 102) {
              this.$toast({
                message: "手机号码已被注册!",
                duration: 5000
              });
            }
          });
      }
    },
    //获取用户信息并保存
    getUserInfo(phone, passWord, isGo) {
      this.$http
        .post(url + "/users/login", {
          userPhone: phone,
          userPwd: passWord
        })
        .then(res => {
          if (res.data.code == 100) {
            if (res.data.data.length > 0) {
              //将客户信息保存至本地
              localStorage.setItem(
                "userInfo",
                JSON.stringify(res.data.data[0])
              );
              if (isGo) {
                if (this.$route.query.isBack) {
                  this.$router.push({
                    path: "/detail",
                    query: {
                      carId: this.$route.query.carId
                    }
                  });
                } else {
                  this.$router.push({ path: this.$route.query.from });
                }
              }
            } else {
              this.$toast({
                message: "用户不存在，请检查手机号密码是否正确!",
                duration: 5000
              });
            }
          }
        });
    },
    goReturn() {
      this.$router.go(-1);
    }
  }
};
</script>
<style>
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
/* .fade-enter {
  transform: translate(-100%, 0);
}
.fade-enter-to,
.fade-leave {
  transform: translate(0, 0);
}
.fade-leave-to {
  transform: translate(100%, 0);
}
.fade-enter-active,
.fade-leave-active {
  transition: 1s;
} */
.loginContent {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #fff;
}
.loginTop {
  position: relative;
  height: 68.75vw;
  margin-bottom: 6vh;
}
.loginTop > img {
  display: block;
  width: 100%;
  height: 100%;
}
.loginBack {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 20px;
}
.loginWord {
  color: #83817e;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
}
.loginWord > div {
  font-size: 16px;
  line-height: 30px;
  font-weight: bold;
}
.mint-cell {
  border-bottom: 1px solid #909090;
  margin: 15px 25vw;
}
.mint-cell-title {
  color: #363a3c;
  text-align: center;
}
.mint-cell-text {
  font-size: 14px;
}
.mint-cell-wrapper {
  display: flex;
  flex-direction: column;
  background-size: 120% 0px;
}
.mint-cell-value {
  position: relative;
}
.mint-field-core {
  text-align: center;
  font-size: 13px;
}
.mint-field-state {
  position: absolute;
  margin: 0;
  right: -10px;
}
.loginButton {
  width: 50%;
  margin-left: 25%;
  border: 1px solid #ccc;
  height: 6vh;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3vh;
  color: #fff;
  margin-top: 5vh;
}
.actived {
  background-color: rgb(209, 49, 52);
}
.unactived {
  background-color: rgba(209, 49, 52, 0.5);
}
.mint-badge {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
}
.loginActived {
  color: #f3f2f0;
  border-bottom: 4px solid #fff;
}
.login-types {
  display: flex;
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
}
.login-item {
  list-style: none;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.login-item > img {
  width: 32px;
}
.title {
  font-size: 13px;
  line-height: 20px;
}
</style>



