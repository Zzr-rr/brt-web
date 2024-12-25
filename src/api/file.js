import axios from "@/api/axois";

const fileApi={
    delete(params){
        return axios.post("brt/file/delete",params)
    },
    getFileList() {
        const body={};
        return axios.post('/brt/file/list/personal',body);  // 假设这是获取文件列表的接口
    },
};

export default fileApi;