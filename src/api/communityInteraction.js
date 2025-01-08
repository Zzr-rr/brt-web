import axios from "axios";

const CommunityApi = {
  ItemAdder(params) {
    return axios.post("/brt/communityInteraction/post", params);
  },
  LikeAdder(params) {
    return axios.post("/api/brt/communityInteraction/like", params); // 假设这是获取文件列表的接口
  },
  CommentAdder(params) {
    return axios.post("/api/brt/communityInteraction/comment", params);
  },
  getLike(params) {
    return axios.get(`/api/brt/communityInteraction/list/like?targetId=${params}`);
  },
  getComment(params) {
    return axios.get(
      `/api/brt/communityInteraction/list/comment?targetId=${params}`
    );
  },
  getIteminfo() {
    return axios.get("/api/brt/communityInteraction/list/postinfo");
  },
};

export default CommunityApi;
