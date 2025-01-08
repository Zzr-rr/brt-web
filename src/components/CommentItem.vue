<template>
  <div>
    <el-card v-for="(comment, index) in commentItem.value" :key="index" class="commentitem">
      <el-row justify="start" align="middle">
        <el-avatar :src="comment.avatarUrl" size="small" style="transform: translate(-10px,-12px);">A</el-avatar>
        <el-col :span="22">
          <div class="critic">中国矿业大学--{{ comment.userId }}</div>
          <div class="comment-content">{{ comment.content }}</div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
const props = defineProps({
  comments: {
    type: Number,
    required: true
  }
});
import CommunityApi from '@/api/communityInteraction';
import { onMounted, reactive } from 'vue';
const commentItem = reactive([]); // 评论列表
const fetchData=async()=>{
  const response= await CommunityApi.getComment(props.comments);
  commentItem.value = response.data.data;
};
onMounted(() => {
  fetchData();
});
</script>

<style scoped>

.commentitem {
  margin-bottom: 20px;
}
</style>
