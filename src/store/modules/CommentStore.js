// store/itemStore.js
import { defineStore } from 'pinia';
import { ItemList as CardItemData } from '@/assets/data/Homeitem';
import authApi from '@/api/auth';

export const useItemStore = defineStore('itemStore', {
  state: () => ({
    item: null,
    newComment: '1',
  }),
  
  actions: {
    loadData(itemId) {
      this.item = CardItemData.find(i => i.id === Number(itemId));
    },
    // loadData(itemId) {
    //   this.item = authApi.getDiscussionById(itemId);
    // },

    // 添加评论
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
