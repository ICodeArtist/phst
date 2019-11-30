<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="订单号">
              <a-input v-model="queryParam.sn" placeholder="输入订单号"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="订单状态">
              <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                <a-select-option value="-1">全部</a-select-option>
                <a-select-option :value="index" v-for="(item,index) in orderstatus" :key="index">{{ item }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="医生姓名">
                <a-input v-model="queryParam.doctorname" placeholder="输入医生姓名"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="省/市/区">
                <a-cascader
                  :options="options"
                  @change="onChange"
                  changeOnSelect
                  placeholder="请选择"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="订单类型">
                <a-select v-model="queryParam.type" placeholder="请选择" default-value="0">
                  <a-select-option :value="index" v-for="(item,index) in ordertype" :key="index">{{ item }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      showPagination="auto"
      :scroll="{ x: 1800 }"
    >
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>
      <span slot="description" slot-scope="text">
        <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleDetail(record)">药品</a>
          <a-divider type="vertical" />
          <a @click="handleEnterPrice(record)">输入价格</a>
          <a-divider type="vertical" />
          <a @click="handleSend(record)">发货</a>
          <!-- <a v-if="record.status === '2'" @click="handleEdit(record)">输入价格</a> -->
          <!-- <a-divider type="vertical" /> -->
          <!-- <a v-if="record.status === '4'" @click="handleSub(record)">发货</a> -->
        </template>
      </span>
    </s-table>
    <a-modal title="药品信息" v-model="infovisible" @ok="hideModal" okText="确认" cancelText="取消">
      <p v-for="(item,index) in recipeldetail.drugguide" :key="index" v-if="recipeldetail.type == '1'">
        {{ item.name }}&nbsp;{{ item.spec }}&nbsp;{{ item.num }}{{ item.pack }}&nbsp;{{ item.userdo }}&nbsp;{{ item.price }}元
      </p>
      <template v-else>
        <p v-for="(item,index) in recipeldetail.drugguide[0].pers.split('|')" :key="index">
          {{ item }}
        </p>
        <p>{{ recipeldetail.drugguide[0].znum }}</p>
        <p>{{ recipeldetail.drugguide[0].userdo }}</p>
        <p>{{ recipeldetail.drugguide[0].price }}元</p>
      </template>
    </a-modal>
    <a-modal
      title="输入价格"
      v-model="visible"
      @ok="PriceEnter"
      okText="确认"
      cancelText="取消"
      :confirmLoading="confirmLoading">
      <template v-if="recipeldetail.type == '1'">
        <p v-for="(item,index) in recipeldetail.drugguide" :key="index" >
          {{ item.name }}&nbsp;{{ item.spec }}&nbsp;{{ item.num }}{{ item.pack }}&nbsp;{{ item.userdo }}&nbsp;
          <span style="float: right;">
            <a-input-number
              :min="0"
              :max="10000"
              v-model="item.price"
              :disabled="recipeldetail.status == 2?false:true"
              :precision="2"
              @change="getallamount"
            />元
          </span>
        </p>
        <p>总价{{ allamount }}</p>
      </template>
      <template v-else-if="recipeldetail.drugguide instanceof Array">
        <p v-for="(item,index) in recipeldetail.drugguide[0].pers.split('|')" :key="index" >
          {{ item }}
        </p>
        <p>{{ recipeldetail.drugguide[0].znum }}</p>
        <p>{{ recipeldetail.drugguide[0].userdo }}</p>
        <a-input-number
          :min="0"
          :max="10000"
          v-model="recipeldetail.drugguide[0].price"
          :disabled="recipeldetail.status == 2?false:true"
          :precision="2"
          @change="getallamount"
        />
      </template>
    </a-modal>
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getRecipelList, getPca, saveRecipelPrice } from '@/api/manage'

const statusMap = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'processing',
    text: '运行中'
  },
  2: {
    status: 'success',
    text: '已上线'
  },
  3: {
    status: 'error',
    text: '异常'
  }
}
const sendtype = ['药店配送', '自提']
const ordertype = ['全部', '中西成药', '饮片', '中药配方颗粒']
const orderstatus = ['待完善信息', '已完善待药师审核', '已审核待输入价格', '待用户支付', '已支付待发货', '已发货', '已完成', '已取消', '待医生完善']
export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis
  },
  data () {
    return {
      // 省市区
      options: [],
      // 药品信息
      recipeldetail: [],
      infovisible: false,
      // 输入价格
      visible: false,
      allamount: 0,
      confirmLoading: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      orderstatus: orderstatus,
      ordertype: ordertype,
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: 'id',
          width: 100
        },
        {
          title: '患者姓名',
          dataIndex: 'nickname',
          width: 100
        },
        {
          title: '医生姓名',
          dataIndex: 'doctorname',
          width: 100
        },
        {
          title: '病状',
          dataIndex: 'illness',
          width: 200
        },
        {
          title: '类型',
          dataIndex: 'type',
          customRender: (text) => ordertype[text],
          width: 100
        },
        {
          title: '生活指导',
          dataIndex: 'lifeguide',
          width: 200
        },
        {
          title: '注意事项',
          dataIndex: 'careinfo',
          width: 200
        },
        {
          title: '总额',
          dataIndex: 'amount',
          customRender: (text) => text + '元',
          width: 100
        },
        {
          title: '状态',
          dataIndex: 'status',
          customRender: (text) => orderstatus[text],
          width: 150
        },
        {
          title: '配送方式',
          dataIndex: 'sendtype',
          customRender: (text) => sendtype[text - 1],
          width: 100
        },
        {
          title: '用药时间',
          width: 200,
          dataIndex: 'create_time'
        },
        {
          title: '操作',
          dataIndex: 'action',
          fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        parameter.token = this.$store.getters.token
        return getRecipelList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.data
          })
      }
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  created () {
    getPca({ 'pid': 0 }).then(res => {
      this.options = res.data
    })
  },
  methods: {
    hideModal () {
      this.infovisible = false
      this.$refs.table.refresh(true)
    },
    onChange (value) {
      this.queryParam.province = value[0] || ''
      this.queryParam.city = value[1] || ''
      this.queryParam.area = value[2] || ''
    },
    handleDetail (record) {
      this.infovisible = true
      this.recipeldetail = record
    },
    handleEnterPrice (record) {
      if (record.status !== '2') {
        this.$error({
          title: '提醒',
          content: '当前订单状态不能输入价格'
        })
      } else {
        this.recipeldetail = record
        this.visible = true
      }
    },
    PriceEnter () {
      const items = {
        recid: this.recipeldetail.recid,
        info: this.recipeldetail.drugguide,
        amount: this.allamount
      }
      this.confirmLoading = true
      saveRecipelPrice(items).then(res => {
        if (res.code === '0') {
          this.$message.success('成功', 1)
          this.$refs.table.refresh(true)
          this.visible = false
          this.confirmLoading = false
        } else {
          this.$message.success('错误', 1)
          this.confirmLoading = false
        }
      })
    },
    handleSend (record) {
      if (record.status !== '4') {
        this.$error({
          title: '提醒',
          content: '当前订单状态不能发货'
        })
      } else {

      }
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {}
    },
    getallamount () {
      let a = 0
      this.recipeldetail.drugguide.forEach(element => {
        a += Number(element.price)
      })
      this.allamount = a.toFixed(2)
    }
  }
}
</script>
