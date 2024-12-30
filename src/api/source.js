import axios from "@/api/axois";

const sourceApi={
     // 上传文件的接口
  uploadContent(params) {
    return axios.post("brt/source/upload/content", params, {
      headers: {
        'Content-Type': 'multipart/form-data' // 设置请求头，告诉服务器发送的是文件
      }
    });
  },
  // 上传图片的接口
  uploadImage(params) {
    return axios.post('/brt/source/upload/image', params, {
      headers: {
        'Content-Type': 'multipart/form-data' // 设置请求头，告诉服务器发送的是文件
      }
    });
  },
};

export default sourceApi;