import axios from "@/api/axois";

const userQuestionProgressApi={
    uploadQuestionProgress(params){
        return axios.post("/brt/userQuestionProgress/create",params);
    },
    getQuestionProgressList() {
        const body={};
        return axios.post('/brt/userQuestionProgress/list',body);
    },
    getQuestionProgressbankList(params){
        return axios.post('/brt/userQuestionProgress/bank/list',params);
    },
    getBankinfoList(){
        return axios.get('/brt/userQuestionProgress/bankinfo/list');
    }
};
export default userQuestionProgressApi;

