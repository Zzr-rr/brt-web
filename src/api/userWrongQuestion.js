import axios from "@/api/axois";

const wrongQuestionApi={
    getWrongQuestionList() {
        const body={};
        return axios.post('/brt/file/list/personal',body);  // 假设这是获取文件列表的接口
    },
};

export default wrongQuestionApi;