<template>
  <el-row :gutter="40" class="discount" >
    <el-col
      :span="6"
      v-for="(item, index) in CardItemData"
      :key="index"
    > 
      <div class="item"  :key="item.id" @click="goToDetail(item.id)">
        <div class="imgItem">
          <img :src="item.imgUrl" />
        </div>
        <div class="info">
          <div class="title">{{ item.title }}</div>
          <div class="desc">{{ item.desc }}</div>
          <div class="bottom">{{ item.time}}</div>
        </div>
      </div>
    </el-col>
  </el-row>
  
</template>

<script setup>
import { ItemList as CardItemData } from "@/assets/data/Homeitem";
import { useRouter } from 'vue-router';
const router=useRouter();
const goToDetail=(id)=>{
  router.push({name:'ItemDetail',params:{id} });

}
</script>

<style lang="less" scoped>
.discount {
  border-radius: 10px;
}

.item {
  margin-bottom: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  width: 100%; 
  height: 200px; 
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }
}

.imgItem {
  height: 45%;
  overflow: hidden;

  img {
    width: 100%;  
    height: 100%; 
    object-fit: cover; 
  }
}

.info {
  padding: 5px;
  flex: 1; 
  background-color: #eeeeee;
  
  .title {
    padding: 5px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 1px;
    font-family: system-ui;
  }

  .desc {
    padding: 8px;
    font-size: 14px;
    color: #0c0c0c;
    line-height: 1;
    font-family: Georgia, serif;
    font-weight: normal;
  }

  .bottom {
    padding: 5px;
    font-size: 13px;
    color: #2d2d2d;
    position: absolute;
    right: 5px;
    bottom: 0;
  }
}
</style>
