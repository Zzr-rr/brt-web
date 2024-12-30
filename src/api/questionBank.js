import axios from "@/api/axois";

const questionBankApi={
    create(params){
        return axios.post("/brt/questionBank/create",params)
    },
    delete(params) {
        return axios.post('/brt/questionBank/delete',params);  // 假设这是获取文件列表的接口
    },
    updateQuestionbank(params) {
      return axios.post('/brt/questionBank/update',params);  // 假设这是获取文件列表的接口
  },
    getBankList() {
        
        const body={};
        return axios.post('/brt/questionBank/list/personal',body);  // 假设这是获取文件列表的接口
},
};

export default questionBankApi;