<template>
  <div>
    <a-form style="margin: 40px auto 0;">
      <result :title="title" :type="restype" :description="description" style="max-width: 560px;">
        <div slot="action" v-if="finishbutton">
          <a-button type="primary" @click="finish">修改资料</a-button>
        </div>
      </result>
    </a-form>
  </div>
</template>

<script>
import { Result } from '@/components'
import { getStep3 } from '@/api/login'
export default {
  name: 'Step3',
  components: {
    Result
  },
  data () {
    return {
      finishbutton: false,
      restype: 'success',
      title: '',
      description: ''
    }
  },
  mounted () {
    getStep3({ 'token': this.$store.getters.token }).then(res => {
      if (res.data.verifystep === '2') {
        this.title = '待审核'
        this.description = '预计两天内审核完成'
      } else if (res.data.verifystep === '3') {
        this.title = '通过'
      } else {
        this.finishbutton = true
        this.restype = 'error'
        this.title = '不通过'
        this.description = res.data.reason
      }
    })
  },
  methods: {
    finish () {
      this.$emit('finish')
    }
  }
}
</script>
<style lang="less" scoped>
  .information {
    line-height: 22px;

    .ant-row:not(:last-child) {
      margin-bottom: 24px;
    }
  }
  .money {
    font-family: "Helvetica Neue",sans-serif;
    font-weight: 500;
    font-size: 20px;
    line-height: 14px;
  }
</style>
