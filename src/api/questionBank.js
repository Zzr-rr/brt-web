import axios from "@/api/axois";

const questionBankApi={
    createQuestionbank(params){
        return axios.post("/brt/questionBank/create",params)
    },
    deleteQuestionbank(params) {
        return axios.post('/brt/questionBank/delete',params);  // 假设这是获取文件列表的接口
    },
    updateQuestionbank(params) {
      return axios.post('/brt/questionBank/update',params);  // 假设这是获取文件列表的接口
  },
    getpersonalQuestionbank(params) {
    return axios.post('/brt/questionBank/list/personal',params);  // 假设这是获取文件列表的接口
},
};

export default questionBankApi;