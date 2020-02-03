<template>
  <div>
    <a-form :form="form" style="max-width: 500px; margin: 5px auto 0;">
      <a-form-item
        label="姓名"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input v-decorator="['realname', { rules: [{required: true, message: '姓名必填'}] }]"/>
      </a-form-item>
      <a-form-item
        label="性别"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-radio-group
          v-decorator="['gender', { rules: [{required: true, message: '性别必填'}] }]">
          <a-radio value="男">
            男
          </a-radio>
          <a-radio value="女">
            女
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="身份证号码"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input v-decorator="['idnum', { rules: [{required: true, message: '身份证号码必填'}] }]"/>
      </a-form-item>
      <a-form-item
        label="药师类型"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-radio-group
          v-decorator="[
            'phsttype',
            {
              'initialValue':'1'
            },]">
          <a-radio value="1">
            中西成药
          </a-radio>
          <a-radio value="2">
            饮片
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </a-form-item>
    </a-form>
    <a-divider />
  </div>
</template>

<script>
import { saveStep1, getStep1 } from '@/api/login'
export default {
  name: 'Step1',
  data () {
    return {
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this)
    }
  },
  created () {
  },
  mounted () {
    getStep1({ 'token': this.$store.getters.token }).then(res => {
      if (res.code === '0') {
        const data = res.data
        this.form.setFieldsValue({ 'realname': data.realname })
        this.form.setFieldsValue({ 'gender': data.gender })
        this.form.setFieldsValue({ 'idnum': data.idnum })
        this.form.setFieldsValue({ 'phsttype': data.phsttype })
      }
    })
  },
  methods: {
    nextStep () {
      const { form: { validateFields } } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          values.token = this.$store.getters.token
          saveStep1(values).then(res => {
            if (res.code !== '0') {
              this.$notification['error']({
                message: '错误',
                description: res.msg || '请求出现错误，请稍后再试',
                duration: 4
              })
            } else {
              this.$emit('nextStep')
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.step-form-style-desc {
  padding: 0 56px;
  color: rgba(0,0,0,.45);

  h3 {
    margin: 0 0 12px;
    color: rgba(0,0,0,.45);
    font-size: 16px;
    line-height: 32px;
  }

  h4 {
    margin: 0 0 4px;
    color: rgba(0,0,0,.45);
    font-size: 14px;
    line-height: 22px;
  }

  p {
    margin-top: 0;
    margin-bottom: 12px;
    line-height: 22px;
  }
}
</style>
