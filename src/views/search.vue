<template>
  <div id="search">
    <div class="title">交通大数据行程卡</div>
    <div class="small-title">疫情防控，人人有责任</div>
    <div class="search-box">
      <div class="car-input">
        <div class="logo"></div>
        <div class="carNum-input">
          <van-field
            v-model="carNum"
            autosize
            @focus="checkCard"
            type=""
            id="myinput"
            name="car"
            placeholder="车牌号"
          />
        </div>
        <div class="border"></div>

        <!-- 车牌颜色选择器 -->
        <div class="color-select">
          <div class="color" @click="showMyPick">{{ carColor }}</div>
          <div class="logo" @click="showMyPick"></div>
        </div>
      </div>

      <div class="fx-text">
        <div class="fx" :class="Jitter ? 'dd' : ''">
          <van-checkbox v-model="checked"></van-checkbox>
        </div>
        <div class="text">
          <p>同意并授权江苏交通查询本车在疫</p>
          <p>情期间14天内到访地信息</p>
        </div>
      </div>

      <div class="search-btn" @click="search" :class="checked ? 'sl' : ''">
        查 询
      </div>
    </div>

    <div class="bottom-text">
      <div class="top">
        <p class="line-text">
          查询结果页会使用绿色、黄色、橙色、红色四种颜色进行标记，规则会按实际情况进行实时调整。
        </p>
        <div class="line-text">
          最新卡面规则:现在国内所有城市均显示
          <span style="color: #1bb21b; font-weight: 700">绿卡</span>
          ，包括港澳台地 区。海外国家和地区显示
          <span style="color: #ecd259; font-weight: 700">黄卡</span>
          ，目前暂无
          <span style="color: #ff2525; font-weight: 700">红卡</span>
          和
          <span style="color: #ff9646; font-weight: 700">橙卡</span>
        </div>

        <div class="line-text">
          到访地右上角*星号标记:表示当前该城市存在中风险或高风险地区，并不表示用户实际到访过这些中高风险地区。
        </div>
      </div>
      <div class="bot">
        <div class="some-border">
          <div class="border-l"></div>
          <div class="text">本服务联合提供</div>
          <div class="border-r"></div>
        </div>
      </div>
      <div class="some-company">
        <div class="line-text">XXX</div>
        <div class="line-text">XXX</div>
        <div class="line-text">XXX</div>
        <div class="line-text">XXX</div>
      </div>
    </div>
    <div class="select-pick" v-if="mypick">
      <van-picker
        title="车牌颜色"
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="onCancel"
        @change="onChange"
      />
    </div>

    <!-- 键盘 -->
    <div id="mixed-keyboard-box" class="select-pick" v-if="mygp">
      <mixed-keyboard :args="myargs" :callbacks="CallbackBridge" />
    </div>
    <div v-if="mygp" @click="hide" class="hide"></div>
  </div>
</template>
<script>
import MixedKeyboard from "../../src/components/MixedKeyboard.vue";
import * as api from "../api/index";
import { Notify } from "vant";
import { Picker } from "vant";
import { Toast } from "vant";

export default {
  name: "search",
  data() {
    return {
      myargs: {
        number: "",
        province: "",
        keyboardtype: 0,
      },
      CallbackBridge: {
        _default: {
          native_callback_changed: function (isCompleted, number) {
            // console.log('[无回调] 输入车牌号码（输入中），当前车牌：' + number);
          },
          native_callback_completed: function (number, isAutoCompleted) {
            // console.log('[无回调] 输入车牌号码（已完成），当前车牌：' + number + '，自动完成：' + isAutoCompleted);
          },
          native_callback_show_message: function (message) {
            // console.log('[无回调] 提示消息：' + message);
            Toast(message)
          },
        },
        platform: function () {
          var isAndroid = typeof android === "object";
          if (isAndroid) {
            return android;
          } else {
            if (typeof global.native_callback_completed === "function") {
              return global;
            } else {
              return this._default;
            }
          }
        },
        onchanged: function (number, plateMode, isCompleted) {
          this.platform().native_callback_changed(isCompleted, number);
        },
        oncommit: function (number, plateMode, isAutoCompleted) {
          this.platform().native_callback_completed(number, isAutoCompleted);
        },
        onmessage: function (message) {
          this.platform().native_callback_show_message(message);
        },
      },
      Jitter: false,
      mypick: false,
      carNum: "",
      checked: false,
      carColor: "蓝",
      columns: [
        "蓝",
        "黄",
        "黑",
        "白",
        "渐变绿色",
        "黄绿双拼色",
        "蓝白渐变色",
        "临时车牌",
        "未确定",
        "绿",
        "红",
      ],
      isLoading: false,
      mygp: false,
    };
  },
  watch: {
    "myargs.number": function (a) {
      this.carNum = a;
    },
  },
  components: {
    MixedKeyboard,
  },
  mounted() {
    // $("#myinput").focus(function(){
    //     document.activeElement.blur();
    // });
  },

  methods: {
    hide() {
      this.mygp = false;
    },
    checkCard() {
      document.activeElement.blur();
      this.mygp = !this.mygp;
    },
    getTime() {
      const myDate = new Date();
      const wk = myDate.getDay();
      const yy = String(myDate.getFullYear());
      let yue = myDate.getMonth() + 1;
      const mm = yue < 10 ? "0" + yue : yue;
      const dd =
        myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate();
      const hou = String(
        myDate.getHours() < 10 ? "0" + myDate.getHours() : myDate.getHours()
      );
      const min = String(
        myDate.getMinutes() < 10
          ? "0" + myDate.getMinutes()
          : myDate.getMinutes()
      );
      const sec = String(
        myDate.getSeconds() < 10
          ? "0" + myDate.getSeconds()
          : myDate.getSeconds()
      );
      var a = yy + "." + mm + "." + dd;
      var b = hou + ":" + min + ":" + sec;
      return a + " " + b;
    },
    search() {
      let value = 0;
      switch (this.carColor) {
        case "蓝":
          value = 0;
          break;
        case "黄":
          value = 1;
          break;
        case "黑":
          value = 2;
          break;
        case "白":
          value = 3;
          break;
        case "渐变绿色":
          value = 4;
          break;
        case "黄绿双拼色":
          value = 5;
          break;
        case "蓝白渐变色":
          value = 6;
          break;
        case "临时车牌":
          value = 7;
          break;
        case "未确定":
          value = 9;
          break;
        case "绿":
          value = 11;
          break;
        case "红":
          value = 12;
          break;

        default:
          "";
          break;
      }
      let ps = {
        parameters: {
          app_key: "2b16f624-96c0-11eb-91ff-e5b5f1c7b11a",
          veh_plate: this.carNum + "_" + value,
        },
      };

      if (this.carNum.trim() == "") {
        Toast("请输入车牌");
        return;
      }
      if (!this.checked) {
        Toast("请勾选");
        this.Jitter = true;
        setTimeout(() => {
          this.Jitter = false;
        }, 1000);
        return;
      }
      if (this.carColor.trim() == "" || this.carColor == "车牌颜色") {
        console.log(this.carColor);
        Toast("请选择车牌颜色");
        return;
      }
      var expresss =
        /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4}))_([蓝黄黑白绿红]{1}|[黄绿]{2}|[临时]{2}|[蓝白]{2}|[渐变绿]{3}))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}_([蓝黄黑白绿红]{1}|[黄绿]{2}|[临时]{2}|[蓝白]{2}|[渐变绿]{3}))$/;
      var result = expresss.test(this.carNum + "_" + this.carColor); // 满足条件时候 正则结果是true
      let url = XXXX;
      if (result) {
        let time = this.getTime();
        api.searchApi(url, ps).then((res) => {
          console.log('跳转页面到 details');
          this.myargs.number = "";
          // this.$router.push({
          //   name: "details",
          //   params: { need: res.data, car: this.carNum + "_" + value, time },
          // });
        });
      } else {
        Toast("请输入正确车牌号");
      }
    },

    showMyPick() {
      this.mypick = !this.mypick;
    },
    onConfirm(value, index) {
      // Toast(`当前值：${value}, 当前索引：${index}`);
      this.carColor = value;
      this.mypick = false;
    },
    onChange(picker, value, index) {
      // Toast(`当前值：${value}, 当前索引：${index}`);
    },
    onCancel() {
      this.mypick = false;
      // Toast("取消");
    },
  },
};
</script>

<style scoped lang="less">
.hide {
  width: 100%;
  height: 100%;
  background: rgba(255, green, blue, 0.1);
  position: absolute;
  /* display: flex; */
  z-index: 10;
  top: 0;
}
.sl {
  background: #327add !important;
}
.dd {
  animation: shake 1.2s steps(5) infinite;
}
@keyframes shake {
  0%,
  100% {
    -webkit-transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    -webkit-transform: translateY(-2px);
  }
  20%,
  40%,
  60%,
  80% {
    -webkit-transform: translateX(2px);
  }
}
@-o-keyframes shake {
  /* Opera */
  0%,
  100% {
    -webkit-transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    -webkit-transform: translateY(-2px);
  }
  20%,
  40%,
  60%,
  80% {
    -webkit-transform: translateX(2px);
  }
}
@-webkit-keyframes shake {
  /* Safari 和 Chrome */
  0%,
  100% {
    -webkit-transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    -webkit-transform: translateY(-2px);
  }
  20%,
  40%,
  60%,
  80% {
    -webkit-transform: translateX(2px);
  }
}
@-moz-keyframes shake {
  /* Firefox */
  0%,
  100% {
    -moz-transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    -moz-transform: translateY(-2px);
  }
  20%,
  40%,
  60%,
  80% {
    -moz-transform: translateX(2px);
  }
}

/deep/ .van-field__control {
  font-size: 0.38rem;
}
@font-face {
  font-family: PHTR;
  src: url("../static/font/W-HYYaKuHeiW.ttf");
}
@font-face {
  font-family: SourceHanSansCN;
  src: url("../static/font/SourceHanSansCN-Heavy.otf");
}
.center {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
}
#search {
  width: 100%;
  height: 100%;
  // background-color: red;
  // position: relative;
  .title {
    width: 67%;
    // position: absolute;
    font-family: "PHTR";
    color: #004394;
    font-size: 30px;
    margin-top: 20px;
    margin-left: 18%;
    // position: absolute;
    // left: 50%;
    // transform: translate(-50%, 0px);
  }
  .small-title {
    color: #004394;
    // position: absolute;
    // top: 10%;
    font-size: 15px;
    margin-top: 21px;
    margin-left: 123px;
    // left: 50%;
    // transform: translate(-50%, 10px);
  }
  .search-box {
    width: 88vw;
    height: 270px;
    /* background: yellow; */
    // position: absolute;
    margin-left: 27px;
    // top: 19%;
    margin-top: 47px;
    border-radius: 10px;
    box-shadow: 1px 2px 13px 4px #eee;

    .car-input {
      width: 92%;
      height: 55px;
      margin-top: 15px;
      margin: 11px 15px;
      // background: yellow;
      overflow: hidden;
      border-bottom: 1px solid #cccccc;
      .logo {
        background: url("../assets/car1.png");
        background-repeat: no-repeat;
        width: 17px;
        background-size: 100% 100%;
        height: 13px;
        margin-top: 21px;
        float: left;
      }
      .carNum-input {
        float: left;
        width: 4.8rem;
        margin-top: 6px;
        // margin-top: 7px;
        //  position: relative;
        // top: 34px;
        // border-right: 1px solid #b7b2b2;
      }
      .border {
        height: 20px;
        width: 2px;
        background: #cccccc;
        float: left;
        margin-top: 18px;
      }
      .color-select {
        float: left;

        .color {
          color: #000;
          font-size: 11px;
          height: 36px;
          // background: red;
          font-size: 14px;
          margin-top: 18px;
          float: left;
          width: 80px;
          text-align: center;
        }
        .logo {
          background: url("../assets/下拉.png");
          background-repeat: no-repeat;
          width: 7px;
          height: 7px;
          background-size: 100% 100%;
          float: right;
          margin-top: 0.65rem;
          // position: absolute;
          // right: 23px;
          // top: 15px;
        }
      }
    }
    .fx-text {
      width: 100%;
      height: 96px;
      // background: yellow;
      position: relative;
      .fx {
        float: left;
        // background: red;
        width: 27px;
        height: 25px;
        position: absolute;
        left: 17px;
        top: 10px;
      }
      .text {
        float: right;
        position: absolute;
        left: 51px;
        top: -8px;
        p {
          // font-family: "SourceHanSansCN";
          color: #999999;
          font-size: 15px;
        }
      }
    }
    .search-btn {
      // position: absolute;
      bottom: 25px;
      width: 90%;
      height: 50px;
      line-height: 50px;
      color: #fff;
      border-radius: 10px;
      background-color: #9fc7fd;
      text-align: center;
      margin-left: 5%;
      font-size: 24px;
    }
  }
  .select-pick {
    position: fixed;
    bottom: 20px;
    width: 100%;
    height: 40vh;
    z-index: 99;
  }
  .bottom-text {
    // position: absolute;
    // top: 67%;
    width: 83%;
    // background: yellow;
    overflow: hidden;
    margin-top: 14px;
    margin-left: 8.5%;
    .top {
      .line-text {
        font-size: 11px;
        color: #999999;
        margin: 4px 0;
        line-height: 19px;
      }
    }
    .bot {
      margin-top: 21px;
      .some-border {
        width: 100%;
        height: 30px;
        overflow: hidden;
        line-height: 30px;
        .border-l {
          float: left;
          width: 79px;
          margin-left: 35px;
          height: 0.5px;
          background: #999;
          margin-top: 14px;
        }
        .text {
          margin: 0 2px;
          float: left;
          color: #999999;
          font-size: 10px;
        }
        .border-r {
          float: left;
          width: 79px;
          // margin-right: 34px;
          height: 0.5px;
          background: #999;
          margin-top: 14px;
        }
      }
    }
    .some-company {
      .line-text {
        font-size: 11px;
        color: #999999;
        margin: 4px 0;
        font-size: 10px;
        text-align: center;
      }
    }
  }
}
</style>
