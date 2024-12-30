import axios from "@/api/axois"; // 确保路径正确，并且axios拼写正确

const axios = require('axios');

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'http://60.204.136.225:6000/brt/source/download/image/4b98a8f3-461d-4348-8d9f-a30b28b730dd_R.jpg',
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});



const sourceApi = {
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
  download(){
    return axios.post('/')
  }
//   // 根据fileurl下载图片
//   downloadImage(fileUrl) {
//     const fullUrl = `http://60.204.136.225:6000${fileUrl}`; // 构造完整的请求URL
//     return axios.get(fullUrl, {
//       responseType: 'blob'
//     }).then((response) => {
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       // 返回图片的URL，而不是直接处理下载
//       return url;
//     }).catch((error) => {
//       console.error("Error downloading the image:", error);
//       throw error;
//     });
//   }
};

export default sourceApi;