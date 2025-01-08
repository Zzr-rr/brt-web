import axios from "@/api/axois";

const userWrongQuestionApi={
    getWrongQuestionList() {
        const body={};
        return axios.post('/brt/userWrongQuestion/list',body);  
    },
    getWrongInfo(){
        return axios.get('/brt/userWrongQuestion/list/wronginfo');  
    },
    UpDate(params){
        return axios.post('/brt/userWrongQuestion/update',params);  
    }
};

export default userWrongQuestionApi;