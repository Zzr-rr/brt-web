<template>
  <div>
    <el-card>
      <el-descriptions class="margin-top" title="简介" :column="2" border>
        <template v-slot:extra>
          <el-button type="primary" size="medium" @click="openEditDialog"
            >修改个人信息</el-button
          >
        </template>

        <!-- 用户头像 -->
        <el-descriptions-item>
          <template v-slot:label>
            <i class="el-icon-picture-outline"></i>
            头像
          </template>
          <img class="img" :src="userInfo.profileImage" alt="用户头像" />
        </el-descriptions-item>

        <!-- 用户名 -->
        <el-descriptions-item>
          <template v-slot:label>
            <i class="el-icon-user"></i>
            用户名
          </template>
          {{ userInfo.username }}
        </el-descriptions-item>

        <!-- 邮箱 -->
        <el-descriptions-item>
          <template v-slot:label>
            <i class="el-icon-message"></i>
            邮箱
          </template>
          {{ userInfo.email }}
        </el-descriptions-item>

        <!-- 手机号码 -->
        <el-descriptions-item>
          <template v-slot:label>
            <i class="el-icon-mobile-phone"></i>
            手机号码
          </template>
          {{ userInfo.phoneNumber }}
        </el-descriptions-item>

        <!-- 名字 -->
        <el-descriptions-item>
          <template v-slot:label>
            <i class="el-icon-s-custom"></i>
            名字
          </template>
          {{ userInfo.firstName }}
        </el-descriptions-item>

        <!-- 姓氏 -->
        <el-descriptions-item>
          <template v-slot:label>
            <i class="el-icon-s-custom"></i>
            姓氏
          </template>
          {{ userInfo.lastName }}
        </el-descriptions-item>

        <!-- 性别 -->
        <el-descriptions-item>
          <template v-slot:label>
            <i class="el-icon-male"></i>
            <i class="el-icon-female"></i>
            性别
          </template>
          <el-tag size="small">{{ userInfo.gender }}</el-tag>
        </el-descriptions-item>

        <!-- 地址 -->
        <el-descriptions-item>
          <template v-slot:label>
            <i class="el-icon-location-outline"></i>
            地址
          </template>
          {{ userInfo.address }}
        </el-descriptions-item>

        <!-- 城市 -->
        <el-descriptions-item>
          <template v-slot:label>
            <i class="el-icon-location"></i>
            城市
          </template>
          {{ userInfo.city }}
        </el-descriptions-item>

        <!-- 国家 -->
        <el-descriptions-item>
          <template v-slot:label>
            <i class="el-icon-map"></i>
            国家
          </template>
          {{ userInfo.country }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 修改个人信息对话框 -->
    <el-dialog
      title="修改个人信息"
      v-model="dialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="150px">
        <!-- 头像上传 -->
        <el-form-item label="上传封面图片" :label-width="formLabelWidth">
          <input type="file" @change="handleCoverImageChange" accept="image/*" />
        </el-form-item>
        <!-- 图片预览 -->
        <div class="image-preview-container">
          <img
            v-if="form.coverImagePreview"
            :src="form.coverImagePreview"
            class="preview-image"
          />
        </div>

        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>

        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>

        <!-- 手机号码 -->
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input v-model="form.phoneNumber"></el-input>
        </el-form-item>

        <!-- 名字 -->
        <el-form-item label="名字" prop="firstName">
          <el-input v-model="form.firstName"></el-input>
        </el-form-item>

        <!-- 姓氏 -->
        <el-form-item label="姓氏" prop="lastName">
          <el-input v-model="form.lastName"></el-input>
        </el-form-item>

        <!-- 性别 -->
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" placeholder="请选择">
            <el-option label="男" value="male"></el-option>
            <el-option label="女" value="female"></el-option>
          </el-select>
        </el-form-item>

        <!-- 地址 -->
        <el-form-item label="地址" prop="address">
          <el-input type="textarea" v-model="form.address"></el-input>
        </el-form-item>

        <!-- 城市 -->
        <el-form-item label="城市" prop="city">
          <el-input v-model="form.city"></el-input>
        </el-form-item>

        <!-- 国家 -->
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
import { ref, onMounted } from "vue";
import personPageApi from "@/api/personPage";
import sourceApi from "@/api/source";
import axios from "axios";
import { use } from "echarts";

// 响应式数据
const dialogVisible = ref(false);
const form = ref({
  profileImage: "",
  username: "",
  email: "",
  phoneNumber: "",
  firstName: "",
  lastName: "",
  gender: "",
  address: "",
  city: "",
  country: "",
});
const userInfo = ref({
  userId: null,
  username: "",
  email: "",
  passwordHash: "",
  phoneNumber: null,
  profileImage: null,
  firstName: "",
  lastName: "",
  dateOfBirth: null,
  gender: null,
  address: null,
  city: null,
  country: null,
  postalCode: null,
  createdAt: null,
  updatedAt: null,
  lastLogin: null,
  isActive: true,
  isVerified: false,
  userRole: "",
  preferences: null,
  bio: null,
  isDeleted: false,
});

// 打开对话框并加载表单数据
const openEditDialog = () => {
  dialogVisible.value = true;
  form.value = {
    profileImage: userInfo.value.profileImage,
    username: userInfo.value.username,
    email: userInfo.value.email,
    phoneNumber: userInfo.value.phoneNumber,
    firstName: userInfo.value.firstName,
    lastName: userInfo.value.lastName,
    gender: userInfo.value.gender,
    address: userInfo.value.address,
    city: userInfo.value.city,
    country: userInfo.value.country,
  };
};


// 加载用户信息
const loadUserInfo = async () => {
  try {
    // 加载用户基本信息
    const response = await personPageApi.info();
    if (response.code === 200) {
      Object.assign(userInfo.value, response.data); // 将所有属性赋值给 userInfo

      // 如果用户有头像（profileImage），调用 download 接口加载头像
      if (response.data.profileImage) {
        try {
          // 拼接 profileImage 到接口地址
          const imageUrl = response.data.profileImage;
          console.log("Image URL:", imageUrl); // 打印图片 URL

          // 使用 axios 加载图片
          const imageResponse = await axios.get('/api' + imageUrl, {
            responseType: 'blob', // 确保响应类型为 blob
          });

          console.log("Image Response Headers:", imageResponse.headers); // 打印响应头
          console.log("Image Response Data:", imageResponse.data); // 打印响应数据

          if (imageResponse.status === 200) {
            // 检查 Content-Type
            if (imageResponse.headers['content-type'].startsWith('image/')) {
              // 将 Blob 数据转换为 URL
              const blobUrl = URL.createObjectURL(imageResponse.data);
              userInfo.value.profileImage = blobUrl; // 更新用户头像
            } else {
              console.error("接口返回的不是图片数据:", imageResponse.headers['content-type']);
              alert("加载头像失败：接口返回的不是图片数据");
            }
          } else {
            console.error("加载用户头像失败:", imageResponse.statusText);
            alert("加载头像失败：" + imageResponse.statusText);
          }
        } catch (error) {
          console.error("加载用户头像时发生错误:", error);
          alert("加载头像时发生错误：" + error.message);
        }
      } else {
        console.warn("用户没有头像");
      }
    } else {
      alert(response.data.message || "加载用户信息失败");
    }
  } catch (error) {
    console.error("Failed to load user info:", error);
    alert("加载用户信息时发生错误");
  }
};

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false;
};


const handleCoverImageChange = async(event) => {
  // 获取选中的第一个文件
  const selectedImage = event.target.files[0];
  if (selectedImage) {
    // 验证文件类型
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp"
    ];
    if (!validImageTypes.includes(selectedImage.type)) {
      alert("不支持的文件类型。请上传JPEG、PNG、GIF或WEBP格式的图片。");
      resetImage();
      return;
    }
    // 验证文件大小
    if (selectedImage.size > 2 * 1024 * 1024) { // 限制为2MB
      alert("文件大小不能超过2MB");
      resetImage();
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedImage); // 将文件添加到 FormData 中
    const response = await sourceApi.uploadImage(formData); // 假设 sourceApi.uploadImage 是上传接口
      if (response.code === 200) {
        // 将返回的 URL 赋值给 form.value.profileImage
        form.value.profileImage = response.data; // 假设返回的数据中有 url 字段
      } else {
        alert(response.message || "图片上传失败");
        resetImage();
      }
    // 设置文件名及预览
    form.value.coverImage = selectedImage; // 保存选中的图片文件
    const reader = new FileReader();
    reader.onload = (e) => {
      form.value.coverImagePreview = e.target.result; // 读取文件并生成预览
    };
    reader.readAsDataURL(selectedImage);
  }
};

// 重置图片
const resetImage = () => {
  form.value.coverImage = null;
  form.value.coverImagePreview = null;
};

//提交修改信息
const submit = async () => {
  try {
    // 将表单中的可编辑属性合并到 userInfo 中
    console.log(form.value.profileImage);
    Object.assign(userInfo.value, {
      profileImage: form.value.profileImage,
      username: form.value.username,
      email: form.value.email,
      phoneNumber: form.value.phoneNumber,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      gender: form.value.gender,
      address: form.value.address,
      city: form.value.city,
      country: form.value.country,
    });

    console.log(userInfo.value);
    // 调用更新接口，传递整个 userInfo 对象
    const response = await personPageApi.update(userInfo.value);
    if (response.code === 200) {
      alert("用户信息更新成功");
      handleClose();
      loadUserInfo(); // 重新加载用户信息
    } else {
      alert(response.message || "更新失败");
    }
  } catch (error) {
    console.error("更新用户信息失败:", error);
    alert("更新用户信息时发生错误");
  }
};

// 生命周期钩子
onMounted(() => {
  loadUserInfo();
});
</script>

<style scoped>
.img {
  width: 80px;
  height: 80px;
}
.image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
.image-preview-container {
  display: flex;
  justify-content: center; /* 水平居中对齐 */
  align-items: center; /* 垂直居中对齐 */
  flex-direction: column; /* 竖向排列容器内的元素 */
  width: 200px; /* 设置固定宽度 */
  height: 200px; /* 设置固定高度 */
  border: 1px solid #ccc; /* 添加边框 */
  margin: 0 auto 10px; /* 水平居中，底部间距为10px */
  overflow: hidden; /* 隐藏溢出部分 */
  position: relative; /* 为绝对定位提供参考 */
}

.preview-image {
  max-width: 100%; /* 最大宽度为容器的100% */
  max-height: 100%; /* 最大高度为容器的100% */
  object-fit: cover;
}
</style>