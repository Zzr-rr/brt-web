<template>
  <div v-if="Isdone">
    <el-card class="box-card">
      <div class="clearfix">
        <span class="head">这是一个帖子</span>
      </div>

      <el-row class="info-row" justify="start" align="middle">
        <!-- <el-col :span="1">
          <el-avatar :src="StoreLoad.item.avatarUrl" />
        </el-col> -->
        <el-col :span="22">
          <div class="writer">发帖人</div>
          <!-- <div class="time">
            {{ StoreLoad.item.time }}&nbsp;{{ StoreLoad.item.spetime }}
          </div> -->
        </el-col>
      </el-row>

      <div class="desc">这是一个简介</div>
      <p class="content">{{ content }}</p>
      <LabelBar :labels=labelList />
    </el-card>

    <el-divider></el-divider>

    <h2 class="commentHead">评论</h2>
    <CommentItem :comments=itemId />

    <el-divider></el-divider>
    <div class="add-comment">
      <el-input
        v-model="newComment"
        placeholder="添加评论..."
        type="textarea"
        :rows="3"
      />
      <el-button type="primary" @click="CommentAdder" style="margin-top: 10px">
        提交评论
      </el-button>
    </div>
  </div>

  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import CommentItem from "@/components/CommentItem.vue";
import LabelBar from "@/components/LabelBar.vue";
import CommunityApi from "@/api/communityInteraction";

// 获取路由参数
const route = useRoute();
const itemId = route.params.id;
const content = route.params.content;
const labelList=["明天","你好"];
// 定义响应式变量
const Isdone = ref(false); // 用于判断数据是否加载完成
const likeItem = reactive([]); // 点赞信息
const newComment = ref(""); // 用户输入的新评论

// 获取数据的函数
const fetchData = async () => {
  try {
    // 获取点赞数据（如果有）
    const response2 = await CommunityApi.getLike(itemId);
    likeItem.value = response2.data.data;

    // 设置数据加载完成标志
    Isdone.value = true;
  } catch (error) {
    console.error("获取数据失败：", error);
    Isdone.value = false;
  }
};

// 提交评论的函数
const CommentAdder = async () => {
  if (newComment.value.trim() === "") {
    alert("评论内容不能为空！");
    return;
  }

  try {
    const response = await CommunityApi.CommentAdder(
      JSON.stringify({
        targetId: +itemId,
        content: newComment.value,
      })
    );

    // 更新评论列表
    if (response.data.success) {
      fetchData(); // 重新获取评论
      newComment.value = ""; // 清空评论输入框
    }
  } catch (error) {
    console.error("提交评论失败：", error);
  }
};

// 在组件挂载时加载数据
onMounted(() => {
  fetchData();
});
</script>

<style lang="less" scoped>
.head {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.time {
  color: #bcbcbc;
  font-size: 12px;
}

.writer {
  font-size: 14px;
  color: #606266;
  margin-top: 5px;
}

.desc {
  margin-top: 10px;
  padding: 10px;
  background-color: #f2f2f2;
  border-radius: 4px;
}

.content {
  margin-top: 10px;
  padding: 10px;
}

.commentHead {
  font-size: 20px;
  margin-top: 20px;
}

.add-comment {
  margin-top: 20px;
}

.info-row {
  margin-top: 10px;
}
</style>
