<template>
  <div>
    <el-card v-for="(comment, index) in commentItem.value" :key="index" class="commentitem">
      <el-row justify="start" align="middle">
        <el-avatar :src="comment.avatarUrl" size="small" style="transform: translate(-10px,-12px);">A</el-avatar>
        <el-col :span="22">
          <div class="critic">中国矿业大学--{{ comment.userId }}</div>
          <div class="comment-content">{{ comment.content }}</div>
        </el-col>
        <div class="like-area">
            <el-icon
              color="#409efc"
              :class="{'active': comment.isLiked}"
              @click.stop="Starone(comment)"
            >
              <Star />
            </el-icon>
            <span>{{ comment.likesCount }}</span>
          </div>
      </el-row>
    </el-card>
  </div>
</template>


<script setup>
import { defineProps, onMounted, reactive } from 'vue';
import CommunityApi from '@/api/communityInteraction';
import { ElIcon } from 'element-plus';  // 引入 Element Plus 图标组件
import { Star } from '@element-plus/icons-vue'; // 引入 Star 图标

const props = defineProps({
  itemId: {
    type: Number,
    required: true
  }
});

const commentItem = reactive([]);  // 评论列表

// 获取评论数据及点赞状态
const fetchData = async () => {
  try {
    const response = await CommunityApi.getComment(props.itemId);
    commentItem.value = response.data.data;
    
    // 获取每个评论的点赞数据
    commentItem.value.forEach(comment => {
      comment.isLiked = false;  // 默认未点赞
    });
  } catch (error) {
    console.error('获取评论数据失败：', error);
  }
};

// 点赞功能
const Starone = async (comment) => {
  // 切换点赞状态
  comment.isLiked = true;
  comment.likesCount += 1;
 

  // 发送点赞请求
  try {
    await CommunityApi.LikeAdder({ targetId: comment.interactionId });
    console.log('点赞操作完成');
  } catch (error) {
    console.error('点赞失败', error);
  }
};

onMounted(() => {
  fetchData();  // 获取数据
});
</script>

<style scoped>
/* 评论卡片样式 */
.commentitem {
  margin-bottom: 20px; /* 每条评论卡片之间的间隔 */
  border: 1px solid #e0e0e0; /* 边框 */
  border-radius: 8px; /* 圆角 */
  padding: 16px; /* 内边距 */
  background-color: #fff; /* 背景颜色 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 阴影 */
  transition: box-shadow 0.3s ease; /* 平滑过渡效果 */
}

.commentitem:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* 鼠标悬停时的阴影效果 */
}

/* 评论内容样式 */
.comment-content {
  font-size: 14px; /* 字体大小 */
  line-height: 1.6; /* 行高 */
  color: #333; /* 字体颜色 */
  margin-top: 8px; /* 与评论者信息的间隔 */
  word-wrap: break-word; /* 自动换行 */
  white-space: pre-line; /* 保留换行 */
}

/* 评论者信息样式 */
.critic {
  font-weight: bold; /* 加粗 */
  color: #333; /* 字体颜色 */
  font-size: 16px; /* 字体大小 */
  margin-bottom: 8px; /* 上下间隔 */
}

/* 头像样式 */
.el-avatar {
  margin-right: 12px; /* 头像与评论内容之间的间距 */
  border-radius: 50%; /* 头像圆形 */
  border: 2px solid #f0f0f0; /* 头像边框 */
}

.el-row {
  display: flex;
  align-items: center;
}

/* 适配移动端，调整头像和评论内容的布局 */
@media (max-width: 768px) {
  .el-avatar {
    margin-right: 8px; /* 头像间距缩小 */
  }
  .el-col {
    span: 24; /* 使评论内容占满整行 */
  }
  .commentitem {
    padding: 12px; /* 缩小卡片的内边距 */
  }
}

/* 点赞区域样式 */
.like-area {
  padding: 5px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.like-area .el-icon {
  font-size: 20px;
  cursor: pointer;
  transition: color 0.3s ease;
}

/* 当点赞星星被点击时，增加 active 样式 */
.like-area .el-icon.active {
  color: #ffd700; /* 星星填充颜色 */
}
</style>

