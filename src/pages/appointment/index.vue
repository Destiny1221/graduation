<template>
  <div class="appointContent">
    <div class="appointmentTitle">我的预约</div>
    <div class="appointView">
      <p>预约人</p>
      <el-input :value="userInfo.userName" readonly></el-input>
    </div>
    <div class="appointView">
      <p>预约手机号</p>
      <el-input v-model="user.phone" placeholder="请输入手机号" :clearable="true"></el-input>
    </div>
    <div class="appointView">
      <p>预约人</p>
      <div style="flex:1">
        <el-radio v-model="user.gender" label="MALE">男</el-radio>
        <el-radio v-model="user.gender" label="FEMALE">女</el-radio>
      </div>
    </div>
    <div class="appointView">
      <p>预约车型</p>
      <el-input :value="car.name" readonly></el-input>
    </div>
    <div class="appointView">
      <p>预约时间</p>
      <el-date-picker v-model="user.appointmentTime" type="date" placeholder="选择日期"></el-date-picker>
    </div>
    <div class="appointmentConfirm" :class="isActive" @click="goAppointment">确定</div>
  </div>
</template>
<script>
import defaultUrl from "@/common/util.js";
const url = defaultUrl.defaultUrl;
export default {
  data() {
    return {
      car: null,
      user: {
        phone: "",
        gender: "",
        appointmentTime: ""
      },
      userInfo: null
    };
  },
  created() {
    let users = JSON.parse(localStorage.getItem("userInfo"));
    let carInfo = JSON.parse(localStorage.getItem("carDetail"));
    this.userInfo = users;
    this.car = carInfo;
  },
  computed: {
    isActive() {
      if (this.user.phone && this.user.gender && this.user.appointmentTime) {
        return "appointChecked";
      } else {
        return "unAppointChecked";
      }
    }
  },
  methods: {
    goAppointment() {
      this.$http
        .post(url + "/appointment/add", {
          customerName: this.userInfo.userName,
          customerPhone: this.user.phone,
          customerGender: this.user.gender,
          appointmentTime: this.user.appointmentTime,
          carId: this.car.id,
          userId: this.userInfo.id
        })
        .then(res => {
          if (res.data.code == 100) {
            this.$toast({
              message: "预约成功",
              duration: 3000
            });
            setTimeout(() => {
              this.$router.push({ path: "/list" });
            }, 3000);
          }
        });
    }
  }
};
</script>
<style>
.appointContent {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.appointmentTitle {
  text-align: center;
  height: 8vh;
  line-height: 8vh;
  box-sizing: border-box;
  border-bottom: 1px solid #ccc;
}
.appointView {
  display: flex;
  align-items: center;
  margin: 20px;
}
.appointView > p {
  width: 75px;
  font-size: 13px;
}
.el-input--suffix,
.el-input {
  flex: 1;
}
.appointmentConfirm {
  margin: 0 20px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #fff;
}
.unAppointChecked {
  background-color: rgba(209, 49, 52, 0.5);
}
.appointChecked {
  background-color: rgba(209, 49, 52);
}
.el-radio__input.is-checked .el-radio__inner {
  border-color: rgba(209, 49, 52);
  background: rgba(209, 49, 52);
}
.el-radio__input.is-checked + .el-radio__label {
  color: rgba(209, 49, 52);
}
</style>


