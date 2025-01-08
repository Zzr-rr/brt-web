import axios from "@/api/axois";

const personPageApi={
    info() {
        return axios.get('/brt/user/info');  // 假设这是获取文件列表的接口
    },
    update(params){
        return axios.post('/brt/user/update',params);
    },
};

export default personPageApi;