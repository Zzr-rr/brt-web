<template>
    <div>
      <el-card>
        <el-descriptions class="margin-top" title="简介" :column="2" border>
          <template v-slot:extra>
            <el-button type="primary" size="medium" @click="openEditDialog">修改个人信息</el-button>
          </template>
  
          <!-- 用户头像 -->
          <el-descriptions-item>
            <template v-slot:label>
              <i class="el-icon-picture-outline"></i>
              头像
            </template>
            <img class="img" :src="profileImage" alt="用户头像" />
          </el-descriptions-item>
  
          <!-- 用户名 -->
          <el-descriptions-item>
            <template v-slot:label>
              <i class="el-icon-user"></i>
              用户名
            </template>
            {{ username }}
          </el-descriptions-item>
  
          <!-- 邮箱 -->
          <el-descriptions-item>
            <template v-slot:label>
              <i class="el-icon-message"></i>
              邮箱
            </template>
            {{ email }}
          </el-descriptions-item>
  
          <!-- 手机号码 -->
          <el-descriptions-item>
            <template v-slot:label>
              <i class="el-icon-mobile-phone"></i>
              手机号码
            </template>
            {{ phoneNumber }}
          </el-descriptions-item>
  
          <!-- 名字 -->
          <el-descriptions-item>
            <template v-slot:label>
              <i class="el-icon-s-custom"></i>
              名字
            </template>
            {{ firstName }}
          </el-descriptions-item>
  
          <!-- 姓氏 -->
          <el-descriptions-item>
            <template v-slot:label>
              <i class="el-icon-s-custom"></i>
              姓氏
            </template>
            {{ lastName }}
          </el-descriptions-item>
  
          <!-- 出生日期 -->
          <el-descriptions-item>
          <template v-slot:label>
            <i class="el-icon-date"></i>
            出生日期
          </template>
          {{ formattedDateOfBirth }} <!-- 使用计算属性 -->
        </el-descriptions-item>
  
          <!-- 性别 -->
          <el-descriptions-item>
            <template v-slot:label>
              <i class="el-icon-male"></i>
              <i class="el-icon-female"></i>
              性别
            </template>
            <el-tag size="small">{{ gender }}</el-tag>
          </el-descriptions-item>
  
          <!-- 地址 -->
          <el-descriptions-item>
            <template v-slot:label>
              <i class="el-icon-location-outline"></i>
              地址
            </template>
            {{ address }}
          </el-descriptions-item>
  
          <!-- 城市 -->
          <el-descriptions-item>
            <template v-slot:label>
              <i class="el-icon-location"></i>
              城市
            </template>
            {{ city }}
          </el-descriptions-item>
  
          <!-- 国家 -->
          <el-descriptions-item>
            <template v-slot:label>
              <i class="el-icon-map"></i>
              国家
            </template>
            {{ country }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
      <!-- 修改个人信息对话框 -->
      <el-dialog
    title="修改个人信息"
    v-model:visible="dialogVisible"
    width="60%"
    :before-close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="form" label-width="150px">
      <!-- 表单项 -->
      <el-form-item label="头像" prop="avatar">
        <el-upload
          action="#"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phoneNumber">
        <el-input v-model="form.phoneNumber"></el-input>
      </el-form-item>
      <el-form-item label="名字" prop="firstName">
        <el-input v-model="form.firstName"></el-input>
      </el-form-item>
      <el-form-item label="姓氏" prop="lastName">
        <el-input v-model="form.lastName"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="form.gender" placeholder="请选择">
          <el-option label="男" value="male"></el-option>
          <el-option label="女" value="female"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input type="textarea" v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="城市" prop="city">
        <el-input v-model="form.city"></el-input>
      </el-form-item>
      <el-form-item label="国家" prop="country">
        <el-input v-model="form.country"></el-input>
      </el-form-item>
    </el-form>
    <!-- 对话框底部 -->
    <template #footer>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">提 交</el-button>
    </template>
  </el-dialog>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted, computed } from 'vue';
import personPageApi from "@/api/personPage";

const dialogVisible = ref(false);
const profileImage = ref("");
const username = ref("");
const email = ref("");
const phoneNumber = ref(null);
const firstName = ref(null);
const lastName = ref(null);
const dateOfBirth = ref(null);
const gender = ref(null);
const address = ref(null);
const city = ref(null);
const country = ref(null);

// 打开对话框
const openEditDialog = () => {
  dialogVisible.value = true;
};

const loadUserInfo = async () => {
  try {
    const response = await personPageApi.info();
    
    if (response.code === 200) {
      const data = response.data;
      profileImage.value = data.profileImage;
      username.value = data.username;
      email.value = data.email;
      phoneNumber.value = data.phoneNumber;
      firstName.value = data.firstName;
      lastName.value = data.lastName;
      dateOfBirth.value = data.dateOfBirth;
      gender.value = data.gender; 
      address.value = data.address;
      city.value = data.city;
      country.value = data.country;
    } else {
      alert(response.data.message || '加载用户信息失败');
    }
  } catch (error) {
    console.error("Failed to load user info:", error);
    alert('加载用户信息时发生错误');
  }
};

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false;
};

// 计算属性来格式化出生日期
const formattedDateOfBirth = computed(() => {
  if (!dateOfBirth.value) return '';
  const date = new Date(dateOfBirth.value); // 假设 dateOfBirth 是一个可解析的日期字符串
  return date.toLocaleDateString(); // 可以根据需要格式化
});

// 生命周期钩子
onMounted(loadUserInfo);
</script>

<style scoped>
.img {
  width: 80px;
  height: 80px;
}
</style>

