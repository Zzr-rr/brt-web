<template>
    <div class="auth-container">
        <el-card class="auth-card">
            <div class="logo-container">
                <img :src="logo" alt="Logo" class="logo" />
                <h2>{{ isLogin ? '登录' : '注册' }}</h2>
            </div>
            <el-form :model="authForm" ref="authForm" :rules="rules" label-width="80px" v-loading="isLoading">

                <el-form-item v-if="!isLogin" label="用户名" prop="username">
                    <el-input v-model="authForm.username" placeholder="请输入用户名" clearable></el-input>
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="authForm.email" placeholder="请输入邮箱" clearable></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input v-model="authForm.password" placeholder="请输入密码" type="password" show-password></el-input>
                </el-form-item>

                <el-form-item v-if="!isLogin" label="确认密码" prop="confirmPassword">
                    <el-input v-model="authForm.confirmPassword" placeholder="请确认密码" type="password"
                        show-password></el-input>
                </el-form-item>

                <el-form-item v-if="!isLogin" label="手机号" prop="phoneNumber">
                    <el-input v-model="authForm.phoneNumber" placeholder="请输入手机号" clearable></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit" size="large" round block>{{ isLogin ? '登录' : '注册'
                        }}</el-button>
                </el-form-item>

                <el-form-item class="toggle-auth">
                    <el-link @click="toggleAuth" underline>{{ isLogin ? '没有账号？立即注册' : '已有账号？立即登录' }}</el-link>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import authApi from '@/api/auth';
import logo from "@/assets/images/logo.png";
export default {
    data() {
        return {
            logo,
            isLogin: true,
            isLoading: false,
            authForm: {
                username: '',
                email: '',
                password: '',
                confirmPassword: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'submit' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'submit' },
                    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['submit'] }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'submit' }
                ],
                confirmPassword: [
                    { required: true, message: '请确认密码', trigger: 'submit' },
                    {
                        validator: (rule, value, callback) => {
                            if (value !== this.authForm.password) {
                                callback(new Error('两次输入的密码不一致'));
                            } else {
                                callback();
                            }
                        }, trigger: 'submit'
                    }
                ]
            }
        };
    },
    methods: {
        onSubmit() {
            this.$refs.authForm.validate(async (valid) => {
                if (valid) {
                    this.isLoading = true;
                    if (this.isLogin) {
                        const requestParam = {
                            email: this.authForm.email,
                            password: this.authForm.password
                        };
                        try {
                            const res = await authApi.login(requestParam);
                            if (res?.code == 200) {
                                this.$message.success('登录成功');
                                setTimeout(() => {
                                    this.$router.push('/');
                                }, 1000);
                            }
                            else {
                                console.log("Login failed", res?.message);
                                this.$message.error(res?.message);
                            }
                        }
                        catch (error) {
                            console.log("Code 500 Login failed", error);
                            this.$message.error(error);
                        }
                    } else {
                        const requestParam = {
                            username: this.authForm.username,
                            email: this.authForm.email,
                            password: this.authForm.password,
                            phoneNumber: this.authForm.phoneNumber
                        };
                        try {
                            const res = await authApi.register(requestParam);
                            console.log(res);
                            if (res?.code == 200) {
                                this.$message.success('注册成功');
                                setTimeout(() => {
                                    this.$router.push('/');
                                }, 1000);
                            }
                            else {
                                console.log("Register failed", res?.code);
                                this.$message.error(res?.message);
                            }
                        } catch (error) {
                            console.log("Code 500 register failed", error);
                            this.$message.error(error);
                        }

                    }
                    this.isLoading = false;
                } else {
                    console.log('表单验证失败');
                    return false;
                }
            });
        },
        toggleAuth() {
            this.isLogin = !this.isLogin;
            this.$refs.authForm.resetFields();
        }
    }
};
</script>

<style scoped>
.auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
}

.auth-card {
    width: 400px;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 24px;
    color: #333;
}

.el-form-item {
    margin-bottom: 20px;
}

.el-input {
    font-size: 14px;
}

.toggle-auth {
    text-align: center;
    margin-top: 20px;
}

.el-link {
    font-size: 14px;
}

.logo-container {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
}

.logo {
    max-width: 40px;
    height: auto;
    margin-right: 10px;
}

h2 {
    font-size: 24px;
    color: #333;
    margin: 0;
}
</style>
