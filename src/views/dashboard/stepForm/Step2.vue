<template>
  <div>
    <a-spin :spinning="spinning" tip="上传中...">
      <a-form layout="vertical" :form="form" style="max-width: 500px; margin: 40px auto 0;">
        <a-alert :closable="true" message="请确保您上传的证件真实有效" style="margin-bottom: 24px;" type="error" />
        <a-form-item label="身份证正面" :labelCol="labelCol" :wrapperCol="wrapperCol" class="stepFormText">
          <img style="height: 150px;" alt="example" src="https://askyisheng.oss-cn-hangzhou.aliyuncs.com/ylz.jpeg" />
          <a-upload v-decorator="['sfzzm', { rules: [{required: true, message: '身份证正面必填'}] }]" accept="image/*" name="file"
            action="https://askapp.wxori.top/index/uploadfile" list-type="picture" @change="handleChange" :fileList="filesfzzm">
            <a-button>
              <a-icon type="upload" /> 点击上传 </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item label="身份证反面" :labelCol="labelCol" :wrapperCol="wrapperCol" class="stepFormText">
          <img style="height: 150px;" alt="example" src="https://askyisheng.oss-cn-hangzhou.aliyuncs.com/ylf.jpeg" />
          <a-upload v-decorator="['sfzfm', { rules: [{required: true, message: '身份证反面必填'}] }]" accept="image/*" name="file"
            action="https://askapp.wxori.top/index/uploadfile" list-type="picture" @change="handleChange2" :fileList="filesfzfm">
            <a-button>
              <a-icon type="upload" /> 点击上传 </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item label="专业资格证书(照片面)" :labelCol="labelCol" :wrapperCol="wrapperCol" class="stepFormText">
          <img style="height: 150px;" alt="example" src="https://askyisheng.oss-cn-hangzhou.aliyuncs.com/yszyzgzs1.jpeg" />
          <a-upload v-decorator="['zyjszgzm', { rules: [{required: true, message: '专业资格证书(照片面)必填'}] }]" accept="image/*"
            name="file" action="https://askapp.wxori.top/index/uploadfile" list-type="picture" @change="handleChange3"
            :fileList="filezyjszgzm">
            <a-button>
              <a-icon type="upload" /> 点击上传 </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item label="专业资格证书(编号面)" :labelCol="labelCol" :wrapperCol="wrapperCol" class="stepFormText">
          <img style="height: 150px;" alt="example" src="https://askyisheng.oss-cn-hangzhou.aliyuncs.com/yszyzgzs2.jpeg" />
          <a-upload v-decorator="['zyjszgfm', { rules: [{required: true, message: '专业资格证书(编号面)必填'}] }]" accept="image/*"
            name="file" action="https://askapp.wxori.top/index/uploadfile" list-type="picture" @change="handleChange4"
            :fileList="filezyjszgfm">
            <a-button>
              <a-icon type="upload" /> 点击上传 </a-button>
          </a-upload>
        </a-form-item>
        <a-divider />

        <a-form-item :wrapperCol="{span: 19, offset: 5}">
          <a-button :loading="loading" type="primary" @click="nextStep">提交</a-button>
          <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>

<script>
  import {
    saveStep2,
    getStep2
  } from '@/api/login'
  export default {
    name: 'Step2',
    data() {
      return {
        // labelCol: { lg: { span: 5 }, sm: { span: 5 } },
        // wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
        labelCol: {},
        wrapperCol: {},
        form: this.$form.createForm(this),
        loading: false,
        timer: 0,
        filesfzzm: [],
        filesfzfm: [],
        filezyjszgzm: [],
        filezyjszgfm: [],
        spinning: false
      }
    },
    mounted() {
      getStep2({
        'token': this.$store.getters.token
      }).then(res => {
        res.data.filesfzzm.url !== null && this.filesfzzm.push(res.data.filesfzzm)
        res.data.filesfzfm.url !== null && this.filesfzfm.push(res.data.filesfzfm)
        res.data.filezyjszgzm.url !== null && this.filezyjszgzm.push(res.data.filezyjszgzm)
        res.data.filezyjszgfm.url !== null && this.filezyjszgfm.push(res.data.filezyjszgfm)
      })
    },
    methods: {
      handleChange(info) {
        this.gospinning(info)
        if (info.fileList.length > 0) {
          let filesfzzm = [...info.fileList]
          let status = 0
          // 1. Limit the number of uploaded files
          //    Only to show two recent uploaded files, and old ones will be replaced by the new
          filesfzzm = filesfzzm.slice(-1)
          // 2. read from response and show file link
          filesfzzm = filesfzzm.map(file => {
            if (file.response) {
              if (file.response.code !== '0') {
                this.$message.error(`${file.response.msg}.`)
                status = 1
              } else {
                file.url = file.response.data.yt
              }
            }
            return file
          })
          this.filesfzzm = status === 1 ? [] : filesfzzm
        } else {
          this.filesfzzm = []
        }
      },
      handleChange2(info) {
        this.gospinning(info)
        if (info.fileList.length > 0) {
          let filesfzfm = [...info.fileList]
          let status = 0
          // 1. Limit the number of uploaded files
          //    Only to show two recent uploaded files, and old ones will be replaced by the new
          filesfzfm = filesfzfm.slice(-1)
          // 2. read from response and show file link
          filesfzfm = filesfzfm.map(file => {
            if (file.response) {
              if (file.response.code !== '0') {
                this.$message.error(`${file.response.msg}.`)
                status = 1
              } else {
                file.url = file.response.data.yt
              }
            }
            return file
          })
          this.filesfzfm = status === 1 ? [] : filesfzfm
        } else {
          this.filesfzfm = []
        }
      },
      handleChange3(info) {
        this.gospinning(info)
        if (info.fileList.length > 0) {
          let filezyjszgzm = [...info.fileList]
          let status = 0
          // 1. Limit the number of uploaded files
          //    Only to show two recent uploaded files, and old ones will be replaced by the new
          filezyjszgzm = filezyjszgzm.slice(-1)
          // 2. read from response and show file link
          filezyjszgzm = filezyjszgzm.map(file => {
            if (file.response) {
              if (file.response.code !== '0') {
                this.$message.error(`${file.response.msg}.`)
                status = 1
              } else {
                file.url = file.response.data.yt
              }
            }
            return file
          })
          this.filezyjszgzm = status === 1 ? [] : filezyjszgzm
        } else {
          this.filezyjszgzm = []
        }
      },
      handleChange4(info) {
        this.gospinning(info)
        if (info.fileList.length > 0) {
          let filezyjszgfm = [...info.fileList]
          let status = 0
          // 1. Limit the number of uploaded files
          //    Only to show two recent uploaded files, and old ones will be replaced by the new
          filezyjszgfm = filezyjszgfm.slice(-1)
          // 2. read from response and show file link
          filezyjszgfm = filezyjszgfm.map(file => {
            if (file.response) {
              if (file.response.code !== '0') {
                this.$message.error(`${file.response.msg}.`)
                status = 1
              } else {
                file.url = file.response.data.yt
              }
            }
            return file
          })
          this.filezyjszgfm = status === 1 ? [] : filezyjszgfm
        } else {
          this.filezyjszgfm = []
        }
      },
      gospinning(info) {
        if (info.file.status === 'uploading') {
          this.spinning = true
        }
        if (info.file.status === 'done') {
          this.spinning = false
        }
      },
      nextStep() {
        const that = this
        console.log(this.filesfzzm)
        if (this.filesfzzm.length < 1) {
          this.form.setFieldsValue({
            'sfzzm': null
          })
        } else {
          this.form.setFieldsValue({
            'sfzzm': this.filesfzzm[0].url
          })
        }
        if (this.filesfzfm.length < 1) {
          this.form.setFieldsValue({
            'sfzfm': null
          })
        } else {
          this.form.setFieldsValue({
            'sfzfm': this.filesfzfm[0].url
          })
        }
        if (this.filezyjszgzm.length < 1) {
          this.form.setFieldsValue({
            'zyjszgzm': null
          })
        } else {
          this.form.setFieldsValue({
            'zyjszgzm': this.filezyjszgzm[0].url
          })
        }
        if (this.filezyjszgfm.length < 1) {
          this.form.setFieldsValue({
            'zyjszgfm': null
          })
        } else {
          this.form.setFieldsValue({
            'zyjszgfm': this.filezyjszgfm[0].url
          })
        }
        const {
          form: {
            validateFields
          }
        } = this
        that.loading = true
        validateFields((err, values) => {
          if (!err) {
            values.token = this.$store.getters.token
            saveStep2(values).then(res => {
              if (res.code !== '0') {
                this.$notification['error']({
                  message: '错误',
                  description: res.msg || '请求出现错误，请稍后再试',
                  duration: 4
                })
              } else {
                this.$emit('nextStep')
              }
            }).finally(res => {
              that.loading = false
            })
          } else {
            that.loading = false
          }
        })
      },
      prevStep() {
        this.$emit('prevStep')
      }
    },
    beforeDestroy() {
      clearTimeout(this.timer)
    }
  }
</script>

<style lang="less" scoped>
  .stepFormText {
    margin-bottom: 24px;

    .ant-form-item-label,
    .ant-form-item-control {
      line-height: 22px;
    }
  }
</style>
