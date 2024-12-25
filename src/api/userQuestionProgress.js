import axios from "@/api/axois";

const userQuestionProgressApi={
    uploadQuestionProgress(params){
        return axios.post("/brt/userQuestionProgress/create",params)
    },
    getQuestionProgressList(params) {
        return axios.post('/brt/userQuestionProgress/list',params);
    },
};
export default userQuestionProgressApi;

