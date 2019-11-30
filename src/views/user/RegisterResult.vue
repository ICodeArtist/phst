<template>
  <result
    :content="false"
    :title="mobile"
    :description="description">

    <template slot="action">
      <a-button type="primary" size="large" style="margin-left: 8px" @click="goHomeHandle">去登陆</a-button>
    </template>

  </result>
</template>

<script>
import { Result } from '@/components'

export default {
  name: 'RegisterResult',
  components: {
    Result
  },
  data () {
    return {
      description: '欢迎加入阿斯克医生药房中心',
      form: {}
    }
  },
  computed: {
    mobile () {
      const v = this.form && this.form.mobile || 'xxx'
      const title = `你的账户：${v} 注册成功`
      return title
    }
  },
  created () {
    this.form = this.$route.params
  },
  methods: {
    goHomeHandle () {
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style scoped>

</style>
