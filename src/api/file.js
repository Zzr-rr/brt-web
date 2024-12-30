import axios from "@/api/axois";

const fileApi={
    delete(params){
        return axios.post("brt/file/delete",params);
    },
    getFileList() {
        const body={};
        return axios.post('/brt/file/list/personal',body);  // 假设这是获取文件列表的接口
    },
    create(params){
        return axios.post('/brt/file/create',params);
    },
    updateFile(params){
        return axios.post('brt/file/update',params);
    }
};

export default fileApi; 