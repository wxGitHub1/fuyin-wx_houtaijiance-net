/**
 * 基础菜单 扫码统计
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>扫码统计</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" size="mini" class="user-search">
      <el-form-item label="搜索：">
        <el-select
          clearable
          
          @change="departmentList(formInline.hospitalId)"
          v-model="formInline.hospitalId"
          placeholder="请选择医院"
        >
          <el-option
            v-for="item in formInline.hospitalList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <!-- <el-input  v-model="formInline.deptName" placeholder="输入医院名称"></el-input> -->
      </el-form-item>
      <el-form-item>
        <el-select
          clearable
          
          @change="doctorList(formInline.departmentId)"
          v-model="formInline.departmentId"
          placeholder="请选择科室"
        >
          <el-option
            v-for="item in formInline.departmentList"
            :key="item.departmentId"
            :label="item.departmentName"
            :value="item.departmentId"
          ></el-option>
        </el-select>
        <!-- <el-input  v-model="formInline.deptNo" placeholder="输入科室名称"></el-input> -->
      </el-form-item>
      <el-form-item>
        <el-select clearable  v-model="formInline.doctorId" placeholder="请选择医生">
          <el-option
            v-for="item in formInline.doctorList"
            :key="item.doctorId"
            :label="item.doctorName"
            :value="item.doctorId"
          ></el-option>
        </el-select>
        <!-- <el-input  v-model="formInline.deptNo" placeholder="输入医生名称"></el-input> -->
      </el-form-item>
      <el-form-item>
        <el-input  v-model="formInline.phone" placeholder="输入客户手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          style="width:100%"
          
          v-model="formInline.accessTime"
          type="daterange"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="访问开始日期"
          end-placeholder="访问结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button  type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button
          
          type="danger"
          icon="el-icon-download"
          :loading="excelLoad"
          @click="exportExcels()"
        >导出</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table
      size="small"
      :data="listData"
      highlight-current-row
      v-loading="loading"
      border
      element-loading-text="拼命加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      style="width: 100%;"
    >
      <!-- <el-table-column align="center" type="selection" width="60"></el-table-column> -->
      <el-table-column prop="hospitalName" label="医院"></el-table-column>
      <el-table-column prop="departmentName" label="科室"></el-table-column>
      <el-table-column prop="doctorName" label="医生"></el-table-column>
      <el-table-column prop="phone" label="客户手机"></el-table-column>
      <!-- <el-table-column prop="reservePhone" label="客户预约手机"></el-table-column> -->
      <el-table-column prop="orderCount" label="下单次数"></el-table-column>
      <el-table-column prop="moneyCount" label="下单金额"></el-table-column>
      <el-table-column prop="accessTime" label="访问时间"></el-table-column>
      <!-- <el-table-column  prop="editTime" label="修改时间" >
        <template slot-scope="scope">
          <div>{{scope.row.editTime|timestampToTime}}</div>
        </template>
      </el-table-column>-->
      <!-- <el-table-column  prop="editUser" label="修改人" ></el-table-column> -->
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleEdit(scope.row)">填写下单信息</el-button>
          <el-button size="mini" type="success" @click="getdataList(scope.row)">下单详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
      <el-form label-width="60px"  :model="editForm">
        <!--:rules="rules"ref="editForm"-->
        <!-- <el-form-item label="下单时间">
          <el-date-picker
            v-model="editForm.orderTime"
            type="datetime"
            size="small"
            style="width: 100%;"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm"
          ></el-date-picker> -->
          <!-- <el-input size="small" v-model="editForm.deptName" placeholder="请输入部门名称"></el-input> :picker-options="pickerOptions"-->
        <!-- </el-form-item> -->
        <!-- <el-form-item label="下单产品"> -->
          <!-- <el-select
            clearable
            size="small"
            style="width: 100%;"
            v-model="editForm.baseId"
            placeholder="请选择下单产品"
          >
            <el-option
              v-for="item in editForm.baseList"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            ></el-option>
          </el-select> -->
          <!-- <el-input size="small" v-model="editForm.baseId" placeholder="请输入下单产品昵称"></el-input>
        </el-form-item>
        <el-form-item label="下单金额">
          <el-input size="small" v-model="editForm.amount" placeholder="请输入下单金额"></el-input>
        </el-form-item> -->
        <el-form-item label="订单号">
          <el-input size="small" v-model="editForm.orderNum" placeholder="请输入订单号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button
          size="small"
          type="primary"
          :loading="loading_bc"
          class="title"
          @click="submitForm()"
        >保存</el-button>
      </div>
    </el-dialog>
    <!-- 详情界面 -->
    <el-dialog :title="title2" :visible.sync="xq_editFormVisible">
      <el-table
        size="small"
        :data="xq_listData"
        highlight-current-row
        v-loading="loading_two"
        border
        element-loading-text="拼命加载中..."
        style="width: 100%;"
      >
        <el-table-column prop="orderTime" label="下单时间"></el-table-column>
        <el-table-column prop="productName" label="下单产品"></el-table-column>
      <el-table-column prop="nickName" label="下单昵称"></el-table-column>
        <el-table-column prop="amount" label="下单金额"></el-table-column>
        <el-table-column prop="orderNum" label="订单号"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  getHospitalList, //医院
  selectDepartmentByHospitalId, //科室
  queryDoctorByDepartmentId, //医生
  queryGuideByPage,
  queryGuideDetail,
  addGuideDetail
} from "../../api/javaApi";
import javaApi from "../../api/javaApi";
// import { deptList, deptSave, deptDelete } from "../../api/userMG";
import Pagination from "../../components/Pagination"; //引入注册组件
import { exportMethod } from "../../utils/public";
export default {
  data() {
    return {
      // pickerOptions: {
      //     disabledDate(time) {
      //       return time.getTime() > Date.now();
      //     },
      //     shortcuts: [{
      //       text: '今天',
      //       onClick(picker) {
      //         picker.$emit('pick', new Date());
      //       }
      //     }, {
      //       text: '昨天',
      //       onClick(picker) {
      //         const date = new Date();
      //         date.setTime(date.getTime() - 3600 * 1000 * 24);
      //         picker.$emit('pick', date);
      //       }
      //     }, {
      //       text: '一周前',
      //       onClick(picker) {
      //         const date = new Date();
      //         date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
      //         picker.$emit('pick', date);
      //       }
      //     }]
      //   },
      excelLoad: false, //导出加载动画
      // nshow: true, //switch开启
      // fshow: false, //switch关闭
      loading: false, //是否显示加载
      loading_two: false, //是显示加载
      loading_bc: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      xq_editFormVisible: false, //控制编辑页面显示与隐藏
      title: "添加",
      title2: "详情",
      editForm: {
        guideId: null,
        orderTime: null,
        baseId: null,
        amount: null,
        orderNum: null,
        accessTime: null,
        baseList: []
        // token: localStorage.getItem("logintoken")
      },
      // rules表单验证
      // rules: {
      //   deptName: [
      //     { required: true, message: "请输入部门名称", trigger: "blur" }
      //   ],
      //   deptNo: [{ required: true, message: "请输入部门代码", trigger: "blur" }]
      // },
      formInline: {
        pageSize: 10,
        pageNum: 1,
        date: null,
        phone: null,
        hospitalId: null,
        departmentId: null,
        doctorId: null,
        hospitalList: [],
        departmentList: [],
        doctorList: []
        // page: 1,
        // limit: 10,
        // varLable: "",
        // varName: "",
        // token: localStorage.getItem("logintoken")
      },
      // 删除部门
      // seletedata: {
      //   ids: "",
      //   token: localStorage.getItem("logintoken")
      // },
      // userparm: [], //搜索权限
      listData: [], //用户数据
      xq_listData: [], //相情数据
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      }
    };
  },
  // 注册组件
  components: {
    Pagination
  },
  /**
   * 数据发生改变
   */

  /**
   * 创建完毕
   */
  created() {
    this.getdata();
    this.hospitals();
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    // 查询列表
    getdata(pageIndex = 1, pageSize = 10) {
      this.loading = true;
      let data = {
        pageSize: this.pageparm.pageSize,
        pageNum: this.pageparm.currentPage,
        hospitalId: this.formInline.hospitalId || null,
        departmentId: this.formInline.departmentId || null,
        doctorId: this.formInline.doctorId || null,
        phone: this.formInline.phone || null,
        accessBeginTime:
          this.formInline.accessTime == null
            ? null
            : this.formInline.accessTime[0] || null,
        accessEndTime:
          this.formInline.accessTime == null
            ? null
            : this.formInline.accessTime[1] || null
      };
      queryGuideByPage(data)
        .then(res => {
          console.log(res);
          this.loading = false;
          if (res.data.returnCode != 0) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true
            });
          } else {
            this.listData = res.data.data;
            this.pageparm.total = res.data.total;
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message.error("菜单加载失败，请稍后再试！");
        });
    },
    getdataList(obj) {
      this.loading_two = true;
      let data = { guideId: obj.guideId };
      queryGuideDetail(data)
        .then(res => {
          console.log(res);
          this.loading_two = false;
          if (res.data.returnCode != 0) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true
            });
          } else {
            this.xq_editFormVisible = true;
            this.xq_listData = res.data.data;
          }
        })
        .catch(err => {
          this.loading_two = false;
          this.$message.error("菜单加载失败，请稍后再试！");
        });
    },
    // 分页插件事件
    callFather(parm) {
      this.pageparm.currentPage = parm.currentPage;
      this.pageparm.pageSize = parm.pageSize;
      this.getdata();
    },
    // 搜索事件
    search() {
      this.getdata();
    },
    //显示编辑界面
    handleEdit(obj) {
      this.editFormVisible = true;
      this.title = "添加";
      this.editForm.guideId = obj.guideId;
      this.editForm.orderTime = null;
      this.editForm.baseId = null;
      this.editForm.amount = null;
      this.editForm.orderNum = null;
    },
    // 编辑、增加页面保存方法
    submitForm() {
      this.loading_bc = true;
      let data = {
        guideId: this.editForm.guideId,
        // orderTime: this.editForm.orderTime || null,
        // baseId: this.editForm.baseId || null,
        // amount: this.editForm.amount || null,
        orderNum: this.editForm.orderNum || null
      };
      addGuideDetail(data)
        .then(res => {
          if (res.data.returnCode != 0) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true
            });
          } else {
            this.editFormVisible = false;
            this.loading_bc = false;
            this.getdata(this.formInline);
            this.$message({
              type: "success",
              message: "保存成功！"
            });
          }
        })
        .catch(err => {
          this.editFormVisible = false;
          this.loading_bc = false;
          this.$message.error("保存失败，请稍后再试！");
        });
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false;
      this.loading_bc=false
    },
    //导出excel
    exportExcels() {
      this.excelLoad = true;
      let data = {
        hospitalId: this.formInline.hospitalId || null,
        departmentId: this.formInline.departmentId || null,
        doctorId: this.formInline.doctorId || null,
        phone: this.formInline.phone || null,
        accessBeginTime:
          this.formInline.accessTime == null
            ? null
            : this.formInline.accessTime[0] || null,
        accessEndTime:
          this.formInline.accessTime == null
            ? null
            : this.formInline.accessTime[1] || null
      }
      const lsyObj = {
        method: "post",
        fileName: "扫码统计信息",
        url: javaApi.ExportUrl,
        data: data
      };
      exportMethod(this, lsyObj);
    },
    //医院
    hospitals() {
      getHospitalList()
        .then(res => {
          console.log(res);
          this.formInline.hospitalList = res.data.data;
        })
        .catch(err => {
          console.log(err);
          // this.$message.error("医院加载失败,请稍后再试!");
        });
    },
    //科室
    departmentList(id) {
      let data = {
        hospitalId: id
      };
      selectDepartmentByHospitalId(data)
        .then(res => {
          // debugger;
          this.formInline.departmentList = res.data.data.departments;
        })
        .catch(err => {
          console.log(err);
          // this.$message.error("科室加载失败,请稍后再试!");
        });
    },
    //医生
    doctorList(id) {
      let data = {
        departmentId: id
      };
      queryDoctorByDepartmentId(data)
        .then(res => {
          // debugger;
          this.formInline.doctorList = res.data.data.doctors;
        })
        .catch(err => {
          // this.$message.error("医生加载失败,请稍后再试!");
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
.user-search {
  margin-top: 20px;
}
.userRole {
  width: 100%;
}
</style>

 
 