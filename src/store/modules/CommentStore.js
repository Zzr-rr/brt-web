// store/itemStore.js
import { defineStore } from 'pinia';
import { ItemList as CardItemData } from '@/assets/data/Homeitem';

export const useItemStore = defineStore('itemStore', {
  state: () => ({
    item: null,
    newComment: '',
  }),
  
  actions: {
    loadData(itemId) {
      this.item = CardItemData.find(i => i.id === Number(itemId));
    },

    // 添加评论
    addComment() {
      if (this.newComment.trim()) {
        this.item.commentslist.push({
          critic: 'Guest',
          content: this.newComment,
          avatarUrl: 'https://randomuser.me/api/portraits/lego/2.jpg',
        });
        this.newComment = ''; // 清空输入框
      }
    },
  },
});
