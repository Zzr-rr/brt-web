const { default: axios } = require("axios")

const fileApi={
    downLoad(params){
        return axios.post("file/download")
    },
    delete(params){
        return axios.post("file/delete")
    }
};