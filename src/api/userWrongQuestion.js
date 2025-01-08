import axios from "@/api/axois";

const userWrongQuestionApi={
    getWrongQuestionList() {
        const body={};
        return axios.post('/brt/userWrongQuestion/list',body);  // 假设这是获取文件列表的接口
    },
    getWrongInfo(){
        return axios.get('/brt/userWrongQuestion/list/wronginfo');  // 假设这是获取文件详情的接口
    }
};

export default userWrongQuestionApi;