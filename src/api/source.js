import axios from "@/api/axois";

const sourceApi={
    uploadContent(params){
        return axios.post("brt/source/upload/content",params)
    },
    uploadImage(params) {
        return axios.post('/brt/source/upload/image',params);
    },
    getFileList() {
        const body={};
        return axios.post('/brt/file/list/personal',body);  // 假设这是获取文件列表的接口
    },
};

export default sourceApi;