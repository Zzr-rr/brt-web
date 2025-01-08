<template>
    <div v-if="StoreLoad.item">
        <el-card class="box-card">
            <div class="clearfix">
                <span class="head">{{ StoreLoad.item.title }}</span>
            </div>

            <el-row class="info-row" justify="start" align="middle">
                <el-col :span="1">
                    11
                    <el-avatar :src="StoreLoad.item.avatarUrl"></el-avatar>
                </el-col>
                <el-col :span="22">
                    <div class="writer">{{ StoreLoad.item.writer }}</div>
                    <div class="time">{{ StoreLoad.item.time }}&nbsp;{{ StoreLoad.item.spetime }}</div>
                </el-col>
            </el-row>

            <div class="desc">{{ StoreLoad.item.desc }}</div>
            <p class="content">{{ StoreLoad.item.content }}</p>
            <LabelBar :labels="StoreLoad.item.labelList"/>
        </el-card>

        <el-divider></el-divider>

        <h2 class="commentHead">评论</h2>
        <CommentItem :comments="StoreLoad.item.commentsList" />

        <el-divider></el-divider>
        <div class="add-comment">
            <el-input v-model="StoreLoad.newComment" placeholder="添加评论..." type="textarea" :rows="3"></el-input>
            <el-button type="primary" @click="StoreLoad.addComment" style="margin-top: 10px">提交评论</el-button>
        </div>
    </div>
    
    <div v-else>
        <p>Loading...</p>
    </div>
</template>

<script setup>
import { onMounted,reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useItemStore } from '@/store/modules/CommentStore';
import CommentItem from '@/components/CommentItem.vue';
import LabelBar from '@/components/LabelBar.vue';
import CommunityApi from '@/api/communityInteraction';
const route = useRoute();
const commentItem=reactive([]);
const likeItem=reactive([]);
const itemId = route.params.id;
const content=route.params.content;
const StoreLoad = useItemStore();
const fetchData=async()=>{
    const response=await CommunityApi.getComment(itemId);
        content.value=response.data;
    const response2=await CommunityApi.getLike(itemId);
        likeItem.value=response2.data;
    console.log(response);
    
}
onMounted(() => {
   
    StoreLoad.loadData(itemId);
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

.commentitem {
    margin-bottom: 15px;
}

.commentHead {
    font-size: 20px;
    margin-top: 20px;
}

.critic {
    font-weight: bold;
}

.comment-content {
    margin-top: 5px;
    font-size: 14px;
}

.add-comment {
    margin-top: 20px;
}

.info-row {
    margin-top: 10px;
}
</style>