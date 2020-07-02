/**
 * 基础菜单 预约信息
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>预约信息</el-breadcrumb-item>
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
        <el-select clearable v-model="formInline.doctorId" placeholder="请选择医生">
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
        <el-input v-model="formInline.phone" placeholder="输入客户手机号"></el-input>
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
        <el-select clearable v-model="formInline.isVisit" placeholder="请选择是否到访">
          <el-option
            v-for="item in formInline.isVisitList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.yuyuephone" placeholder="输入客户预约手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
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
    >
      <!-- <el-table-column align="center" type="selection" width="60"></el-table-column> -->
      <el-table-column prop="hospital" label="医院"></el-table-column>
      <el-table-column prop="deptment" label="科室"></el-table-column>
      <el-table-column prop="doctor" label="医生"></el-table-column>
      <el-table-column prop="visittime" label="访问时间"></el-table-column>
      <el-table-column prop="scanphone" label="客户扫描手机"></el-table-column>
      <!-- <el-table-column prop="yuyuephone" label="客户预约手机"></el-table-column> -->
      <el-table-column prop="yuyuetime" label="预约时间"></el-table-column>
      <el-table-column prop="isvisit" label="是否到访"></el-table-column>

      <!-- <el-table-column  prop="editTime" label="修改时间" >
        <template slot-scope="scope">
          <div>{{scope.row.editTime|timestampToTime}}</div>
        </template>
      </el-table-column>-->
      <!-- <el-table-column  prop="editUser" label="修改人" ></el-table-column> -->
      <el-table-column align="center" label="操作" width="400">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="confirm_visit_func(scope.row.scanid)">确认到访</el-button>
          <el-button size="mini" type="success" @click="change_number_func(scope.row)">修改号码</el-button>
          <el-button
            size="mini"
            type="success"
            @click="modify_appointment_time_func(scope.row)"
          >预约时间修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
      <el-form label-width="60px" :model="editForm">
        <!--:rules="rules"ref="editForm"-->
        <!-- <el-form-item label="下单时间">
          <el-date-picker
            v-model="editForm.orderTime"
            type="datetime"
            size="small"
            style="width: 100%;"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm"
        ></el-date-picker>-->
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
        </el-select>-->
        <!-- <el-input size="small" v-model="editForm.baseId" placeholder="请输入下单产品昵称"></el-input>
        </el-form-item>
        <el-form-item label="下单金额">
          <el-input size="small" v-model="editForm.amount" placeholder="请输入下单金额"></el-input>
        </el-form-item>-->
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
    <!-- 修改号码界面 -->
    <el-dialog
      :title="title3"
      :visible.sync="change_number_dialog"
      :before-close="change_number_cancel"
      width="30%"
    >
      <el-form :inline="true" size="small" id="search">
        <el-form-item label="手机号">
          <el-input class="w-150" clearable v-model="modify_phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button
          @click="change_number_cancel()"
          type="primary"
          size="mini"
          icon="el-icon-circle-close"
        >关闭</el-button>
        <el-button
          @click="change_number_save()"
          type="success"
          size="mini"
          icon="el-icon-circle-plus-outline"
        >保存</el-button>
      </span>
    </el-dialog>
    <!-- 修改预约时间界面 -->
    <el-dialog
      :title="title4"
      :visible.sync="modify_appointment_time_dialog"
      :before-close="modify_appointment_time_cancel"
      width="30%"
    >
      <el-form :inline="false" size="small" id="search">
        <el-form-item label="预约时间">
          <el-date-picker
            size="mini"
            v-model="modify.time"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="是否拒绝不来">
          <el-radio-group v-model="modify.isGo" @change="isGo_func(modify.isGo)">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="不来的原因" v-if="isReason">
          <el-input type="textarea" v-model="modify.reason"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button
          @click="modify_appointment_time_cancel()"
          type="primary"
          size="mini"
          icon="el-icon-circle-close"
        >关闭</el-button>
        <el-button
          @click="modify_appointment_time_save()"
          type="success"
          size="mini"
          icon="el-icon-circle-plus-outline"
        >保存</el-button>
      </span>
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
  addGuideDetail,
  //二龙
  GetScanGongZhongHaoList,
  InsertGongZhongHao
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
      change_number_dialog: false, //修改号码弹框
      modify_appointment_time_dialog: false, //修改预约时间弹框
      title: "添加",
      title2: "详情",
      title3: "修改号码",
      title4: "预约时间修改",
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
        yuyuephone: null,
        hospitalId: null,
        departmentId: null,
        doctorId: null,
        hospitalList: [],
        departmentList: [],
        doctorList: [],
        isVisitList: [
          { name: "是", id: 1 },
          { name: "否", id: 2 }
        ],
        isVisit: null,
        accessTime: null
        // page: 1,
        // limit: 10,
        // varLable: "",
        // varName: "",
        // token: localStorage.getItem("logintoken")
      },
      modify: {
        time: null,
        isGo: "",
        reason: null
      },
      isReason: true,
      modify_phone: null, //修改手机号
      scanid: null, //用户唯一id
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
    isGo_func(isGo) {
      if (isGo == "是") {
        this.isReason = true;
      } else {
        this.isReason = false;
      }
    },
    modify_appointment_time_cancel() {
      this.modify_appointment_time_dialog = false;
      this.modify.time=null
      this.modify.isGo=""
      this.modify.reason=null
    },
    modify_appointment_time_save() {
      let data = {
        scanid: this.scanid,
        yuyuetime: this.modify.time,
        reson: this.modify.reason
      };
      InsertGongZhongHao(data)
        .then(res => {
          console.log(res);
          this.loading = false;
          if (res.data.Error != false) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true
            });
          } else {
            this.modify_appointment_time_cancel();
            this.getdata();
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    modify_appointment_time_func(obj) {
      this.scanid = obj.scanid;
      this.modify_appointment_time_dialog = true;
      this.modify.time=obj.yuyuetime
      this.modify.isGo= obj.isjujue
      this.modify.reason= obj.reson
      this.isGo_func(obj.isjujue)
    },
    confirm_visit_func(id) {
      let deleteData = {
        scanid: id
      };
      // debugger
      this.$confirm("是否确认到访？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          InsertGongZhongHao(deleteData)
            .then(res => {
              // debugger
              if (res.data.Error != false) {
                this.$message({
                  type: "warning",
                  message: res.data.returnMsg,
                  center: true
                });
              } else {
                setTimeout(() => {
                  this.$message({
                    type: "success",
                    message: "确认成功！",
                    center: true
                  });
                  this.getdata();
                }, 500);
              }
            })
            .catch(err => {
              reject(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除"
          });
        });
    },
    change_number_cancel() {
      this.change_number_dialog = false;
    },
    change_number_save() {
      let data = {
        scanid: this.scanid,
        yuyuephone: this.modify_phone
      };
      InsertGongZhongHao(data)
        .then(res => {
          console.log(res);
          this.loading = false;
          if (res.data.Error != false) {
            this.$message({
              type: "warning",
              message: res.data.returnMsg,
              center: true
            });
          } else {
            this.change_number_cancel();
            this.getdata();
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    change_number_func(obj) {
      this.scanid = obj.scanid;
      this.change_number_dialog = true;
      this.modify_phone=obj.scanphone
    },
    // 查询列表
    getdata(pageIndex = 1, pageSize = 10) {
      this.loading = true;
      let hospitalName = null;
      let deptmentName = null;
      let doctorName = null;
      if (this.formInline.hospitalId) {
        this.formInline.hospitalList.forEach(obj => {
          if (this.formInline.hospitalId == obj.id) {
            hospitalName = obj.name;
          }
        });
      }
      if (this.formInline.departmentId) {
        this.formInline.departmentList.forEach(obj => {
          if (this.formInline.departmentId == obj.departmentId) {
            deptmentName = obj.departmentName;
          }
        });
      }
      if (this.formInline.doctorId) {
        this.formInline.doctorList.forEach(obj => {
          if (this.formInline.doctorId == obj.doctorId) {
            doctorName = obj.name;
          }
        });
      }
      let data = {
        pageSize: this.pageparm.pageSize,
        pageIndex: this.pageparm.currentPage,
        WhereLambda: {
          hospital: hospitalName,
          deptment: deptmentName,
          doctor: doctorName,
          scanphone: this.formInline.phone || null,
          yuyuephone: this.formInline.yuyuephone || null,
          isvisit: this.formInline.isVisit || null,
          startyuyuetime:
            this.formInline.accessTime == null
              ? null
              : this.formInline.accessTime[0],
          endyuyuetime:
            this.formInline.accessTime == null
              ? null
              : this.formInline.accessTime[1]
        }
      };
      GetScanGongZhongHaoList(data)
        .then(res => {
          console.log(res);
          this.loading = false;
          if (res.data.Error != false) {
            this.$message({
              type: "warning",
              message: res.data.ErrorMessage,
              center: true
            });
            this.listData = [];
            this.pageparm.total = 0;
          } else {
            this.listData = res.data.ResponseModel.list;
            this.pageparm.total = res.data.ResponseModel.total;
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
      this.loading_bc = false;
    },
    //导出excel
    exportExcels() {
      // this.excelLoad = true;
      let hospitalName = null;
      let deptmentName = null;
      let doctorName = null;
      if (this.formInline.hospitalId) {
        this.formInline.hospitalList.forEach(obj => {
          if (this.formInline.hospitalId == obj.id) {
            hospitalName = obj.name;
          }
        });
      }
      if (this.formInline.departmentId) {
        this.formInline.departmentList.forEach(obj => {
          if (this.formInline.departmentId == obj.departmentId) {
            deptmentName = obj.departmentName;
          }
        });
      }
      if (this.formInline.doctorId) {
        this.formInline.doctorList.forEach(obj => {
          if (this.formInline.doctorId == obj.doctorId) {
            doctorName = obj.name;
          }
        });
      }
      let data = {
        hospital: hospitalName,
        deptment: deptmentName,
        doctor: doctorName,
        scanphone: this.formInline.phone || null,
        yuyuephone: this.formInline.yuyuephone || null,
        isvisit: this.formInline.isVisit || null,
        startyuyuetime:
          this.formInline.accessTime == null
            ? null
            : this.formInline.accessTime[0],
        endyuyuetime:
          this.formInline.accessTime == null
            ? null
            : this.formInline.accessTime[1]
      };
      let myurl =
        javaApi.ExportDataGongZhongHao2 +
        "?hospital=" +
        data.hospital +
        "&deptment=" +
        data.deptment +
        "&doctor=" +
        data.doctor +
        "&scanphone=" +
        data.scanphone +
        "&isvisit=" +
        data.isvisit +
        "&yuyuephone=" +
        data.yuyuephone +
        "&startyuyuetime=" +
        data.startyuyuetime +
        "&endyuyuetime=" +
        data.endyuyuetime;
      window.open(myurl);
      // const lsyObj = {
      //   method: "post",
      //   fileName: "预约信息",
      //   url: javaApi.ExportDataGongZhongHao2,
      //   data: data
      // };
      // exportMethod(this, lsyObj);
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

 
 