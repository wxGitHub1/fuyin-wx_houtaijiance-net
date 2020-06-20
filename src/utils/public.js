import axios from 'axios'
// 导出Excel公用方法
/**
 * 
 * @param {*} lsyObj 李思雨导出文件集合
 * @param {*} self vue this对象
 *  method   方法
 *  url      路径
 *  data     数据
 */
export function exportMethod(self, lsyObj) {
  axios({
    method: lsyObj.method,
    url: lsyObj.url,
    data: lsyObj.data,
    responseType: 'blob'
  }).then((res) => {
    // debugger
    const link = document.createElement('a')
    let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    // link.download = res.headers['content-disposition'] //下载后文件名
    link.download = lsyObj.fileName //下载的文件名
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    self.$message({
      type: "success",
      message: "导出成功！",
      center: true
    });
    self.excelLoad = false
  }).catch(error => {
    self.$message({
      type: "error",
      message: "导出错误！",
      center: true
    });
    console.log(error)
  })
}