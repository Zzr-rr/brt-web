import axios from "@/api/axois";

const userQuestionProgressApi={
    uploadQuestionProgress(params){
        return axios.post("/brt/userQuestionProgress/create",params)
    },
    getQuestionProgressList() {
        const body={};
        return axios.post('/brt/userQuestionProgress/list',body);
    },
};
export default userQuestionProgressApi;

