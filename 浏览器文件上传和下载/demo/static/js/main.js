/**
 * @desc: 文件描述
 * @author: zengtiansheng
 * @update: 2018/4/17
 */
console.log('---formData--')
class Main{
    constructor(){
        this.btnListener()
    }
    btnListener() {
        console.log('---formData-1-')
        document.querySelector('#J_btn_upload_type1').addEventListener('click', this.fileUploadType1, false)
        document.querySelector('#J_btn_upload_type2').addEventListener('click', this.fileUploadType2, false)
    }
    fileUploadType1() {
        const file = document.querySelector('#J_file_type1').files[0]
        const formData = new FormData()
        // 建立一个upload表单项，值为上传的文件
        formData.append('file', file)
        formData.append('name', file.name)
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/api/uploadFile')
        // 定义上传完成后的回调函数
        xhr.onload = function () {
            if (xhr.status === 200) {
                alert('上传成功')
            } else {
                alert('出错了')
            }
        }
        xhr.send(formData);
    }
    fileUploadType2() {
        console.log('---fileUploadType2---')
    }
}
new Main()