// store/itemStore.js
import { defineStore } from 'pinia';
import { ItemList as CardItemData } from '@/assets/data/MyBank';

export const useItemStore = defineStore('itemStore', {
  state: () => ({
    item: null,
    newComment: '1',
    learningbanklistLoading: false,
    learingWronglistLoading:false,
    questionLoading: false,
    SingleQuestionLoading:false,
  }),
  
  actions: {
    setSingleQuestionLoading(isloading){
      this.SingleQuestionLoading=isloading;
    },
    setlearingWronglistLoading(isloading){
      this.learingWronglistLoading=isloading;
    },
    setlearningbanklistLoading(isloading){
      this.learningbanklistLoading=isloading;
    },
    setquestionLodaing(isloading){
      this.questionLoading=isloading;
    },
    loadData(itemId) {
      this.item = CardItemData.find(i => i.id === Number(itemId));
    },
    addComment() {
      if (this.newComment.trim()) {
        if (!this.item.commentsList) {
          this.item.commentsList = [];
        }
        this.item.commentsList.push({
          critic: 'Guest',
          content: this.newComment,
          avatarUrl: 'https://randomuser.me/api/portraits/lego/2.jpg',
        });
        this.newComment = ''; // 清空输入框
      }
    },
  },
});
