<template>
  <page-view :avatar="avatar" :title="false">
    <div slot="headerContent">
      <div class="title">{{ timeFix }}，{{ user.name }}</div>
    </div>
    <div>
      <a-card :bordered="false" v-if="verifypass == 0">
        <a-steps class="steps" :current="currentTab">
          <a-step title="填写基本信息" />
          <a-step title="上传证件" />
          <a-step title="完成" />
        </a-steps>
        <div class="content">
          <step1 v-if="currentTab === 0" @nextStep="nextStep"/>
          <step2 v-if="currentTab === 1" @nextStep="nextStep" @prevStep="prevStep"/>
          <step3 v-if="currentTab === 2" @prevStep="prevStep" @finish="finish"/>
        </div>
      </a-card>
      <div v-else style="font-size: 50px;text-align: center;margin-top: 20%;">
        欢迎进入药店平台
      </div>
    </div>
  </page-view>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapState } from 'vuex'
import { getVerify } from '@/api/login'
import { PageView } from '@/layouts'

import Step1 from './stepForm/Step1'
import Step2 from './stepForm/Step2'
import Step3 from './stepForm/Step3'

export default {
  name: 'Workplace',
  components: {
    PageView,
    Step1,
    Step2,
    Step3
  },
  data () {
    return {
      timeFix: timeFix(),
      avatar: '',
      user: {},
      currentTab: 3,
      verifypass: 0
    }
  },
  computed: {
    ...mapState({
      nickname: (state) => state.user.nickname,
      welcome: (state) => state.user.welcome
    }),
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar
  },
  mounted () {
    getVerify({ 'token': this.$store.getters.token }).then(res => {
      this.currentTab = res.code === '-1' || res.data.verifystep === '1' ? 0 : 2
      this.verifypass = res.code === '-1' || res.data.verifystep !== '3' ? 0 : 1
    })
  },
  methods: {
    nextStep () {
      if (this.currentTab < 2) {
        this.currentTab += 1
      }
    },
    prevStep () {
      if (this.currentTab > 0) {
        this.currentTab -= 1
      }
    },
    finish () {
      this.currentTab = 0
    }
  }
}
</script>

<style lang="less" scoped>
  .project-list {

    .card-title {
      font-size: 0;

      a {
        color: rgba(0, 0, 0, 0.85);
        margin-left: 12px;
        line-height: 24px;
        height: 24px;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;

        &:hover {
          color: #1890ff;
        }
      }
    }
    .card-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
    .project-item {
      display: flex;
      margin-top: 8px;
      overflow: hidden;
      font-size: 12px;
      height: 20px;
      line-height: 20px;
      a {
        color: rgba(0, 0, 0, 0.45);
        display: inline-block;
        flex: 1 1 0;

        &:hover {
          color: #1890ff;
        }
      }
      .datetime {
        color: rgba(0, 0, 0, 0.25);
        flex: 0 0 auto;
        float: right;
      }
    }
    .ant-card-meta-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
  }

  .item-group {
    padding: 20px 0 8px 24px;
    font-size: 0;
    a {
      color: rgba(0, 0, 0, 0.65);
      display: inline-block;
      font-size: 14px;
      margin-bottom: 13px;
      width: 25%;
    }
  }

  .members {
    a {
      display: block;
      margin: 12px 0;
      line-height: 24px;
      height: 24px;
      .member {
        font-size: 14px;
        color: rgba(0, 0, 0, .65);
        line-height: 24px;
        max-width: 100px;
        vertical-align: top;
        margin-left: 12px;
        transition: all 0.3s;
        display: inline-block;
      }
      &:hover {
        span {
          color: #1890ff;
        }
      }
    }
  }

  .mobile {

    .project-list {

      .project-card-grid {
        width: 100%;
      }
    }

    .more-info {
      border: 0;
      padding-top: 16px;
      margin: 16px 0 16px;
    }

    .headerContent .title .welcome-text {
      display: none;
    }
  }

</style>
