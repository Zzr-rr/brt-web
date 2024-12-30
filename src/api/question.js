import axios from "@/api/axois";

const questionApi={
    getQuestionList(params) {
        return axios.post('/brt//question/list',params);  // 假设这是获取文件列表的接口
    },

};

export default questionApi;