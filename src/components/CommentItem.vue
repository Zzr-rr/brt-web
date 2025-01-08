<template>
  <div>
    <el-card v-for="(comment, index) in comments" :key="index" class="commentitem">
      <el-row justify="start" align="middle">
        <el-avatar :src="comment.avatarUrl" size="small" style="transform: translate(-10px,-12px);">A</el-avatar>
        <el-col :span="22">
          <div class="critic">{{ comment.critic }}</div>
          <div class="comment-content">{{ comment.content }}</div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
defineProps({
  comments: {
    type: Number,
    required: true
  }
});
import CommunityApi from '@/api/communityInteraction';
const fecthData=async()=>{
  
}
}
</script>

<style scoped>

.commentitem {
  margin-bottom: 20px;
}
</style>
