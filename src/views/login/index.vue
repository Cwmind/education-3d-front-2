<template>
  <div class="login">
    <div class="login-logo">
      <img src="@/assets/login/login-logo.png" alt="logo" />
    </div>
    <!-- <div class="login-language">
      <el-select v-model="currentLocale" style="width: 150px" @change="changeLocale">
        <template #label>
          <div class="login-language-label">
            <img src="@/assets/login/login-language.svg" alt="language" />language
          </div>
        </template>
        <el-option
          v-for="item in locales"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div> -->
    <div class="login-container">
      <div class="login-container-title">欢迎使用新能源锂离子电池制造工艺实训平台</div>
      <div class="login-container-form">
        <div class="login-container-form-title">账号登录</div>
        <el-form ref="loginRef" :model="loginForm" :rules="loginRules">
          <el-form-item prop="username" class="login-container-form-username">
            <el-input
              v-model="loginForm.username"
              type="text"
              auto-complete="off"
              placeholder="请输入账号"
            >
              <template #prefix>
                <img src="@/assets/images/user.svg" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password" class="login-container-form-password">
            <el-input
              v-model="loginForm.password"
              type="password"
              auto-complete="off"
              placeholder="请输入账号密码"
              show-password
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <img src="@/assets/images/password.svg" />
              </template>
            </el-input>
          </el-form-item>
          <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 24px 0px">
            记住密码
          </el-checkbox>
          <el-button
            :loading="loading"
            class="login-container-form-button"
            @click.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form>
      </div>
    </div>
    <!--  底部  -->
    <div class="login-copyright">Gotion-实训软件版 V1.0</div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/utils/jsencrypt'
import useUserStore from '@/store/modules/user'
// import { LOCALE_OPTIONS } from '@/locale'
// import useLocale from '@/hooks/locale'

// const { changeLocale, currentLocale } = useLocale()
// const locales = [...LOCALE_OPTIONS]

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()

const loginForm = ref({
  username: '',
  password: '',
  rememberMe: false,
  uuid: ''
})

const loginRules = {
  username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
  password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }]
}

const loading = ref(false)
const redirect = ref(undefined)

watch(
  route,
  (newRoute) => {
    redirect.value = newRoute.query && newRoute.query.redirect
  },
  { immediate: true }
)

// 定义登录处理函数，当用户点击登录按钮时会调用这个函数
function handleLogin() {
  // proxy 是一个代理对象，通常用于在 setup 中访问组件实例的属性和方法
  // $refs.loginRef 是通过 ref 引用获取到的登录表单组件实例
  // validate 是表单组件的验证方法，用于检查表单输入是否符合规则
  // 它接收一个回调函数，参数 valid 是布尔值，表示表单验证是否通过
  proxy.$refs.loginRef.validate((valid) => {
    // 如果表单验证通过（valid 为 true），则执行登录逻辑
    if (valid) {
      // loading 是一个响应式变量（通常由 ref 定义），用于控制登录按钮的加载状态
      // 设置为 true 时，按钮会显示加载动画，防止用户重复点击提交
      loading.value = true

      // 判断用户是否勾选了"记住我"选项（loginForm 是存储登录表单数据的响应式对象）
      if (loginForm.value.rememberMe) {
        // 如果勾选了，就把用户名、加密后的密码、记住我状态存入 Cookie
        // Cookies.set 是操作 Cookie 的方法，参数分别是：键名、值、配置（这里设置 30 天过期）
        // 存储用户名
        Cookies.set('username', loginForm.value.username, { expires: 30 })
        // 存储加密后的密码（encrypt 是加密函数，防止密码明文存储，提高安全性）
        Cookies.set('password', encrypt(loginForm.value.password), { expires: 30 })
        // 存储"记住我"的勾选状态
        Cookies.set('rememberMe', loginForm.value.rememberMe, { expires: 30 })
      } else {
        // 如果没勾选"记住我"，就移除之前可能存储在 Cookie 中的这些信息
        Cookies.remove('username')
        Cookies.remove('password')
        Cookies.remove('rememberMe')
      }

      // 调用 Vuex 中 user 模块的 login 方法（异步操作，返回 Promise）
      // 传入登录表单数据（用户名、密码等）
      userStore
        .login(loginForm.value)
        // 登录成功后执行的逻辑（Promise 的 then 回调）
        .then(() => {
          // route 是当前路由信息对象，route.query 是 URL 中问号后面的查询参数（如 ?redirect=/home&a=1）
          const query = route.query

          // 处理查询参数：保留除了 redirect 之外的其他参数
          // reduce 是数组的遍历方法，这里用于把 query 对象转换成新对象
          // acc 是累加器（初始值为 {}），cur 是当前遍历的键名
          const otherQueryParams = Object.keys(query).reduce((acc, cur) => {
            // 如果当前键不是 redirect，就把它加入到新对象中
            if (cur !== 'redirect') {
              acc[cur] = query[cur]
            }
            return acc
          }, {})

          // 登录成功后跳转到指定页面
          // router.push 是路由跳转方法
          // path: 跳转的路径，优先使用 redirect.value（登录前想访问的页面），如果没有就跳转到首页 /
          // query: 携带除了 redirect 之外的其他查询参数
          router.push({ path: redirect.value || '/', query: otherQueryParams })
        })
        // 登录失败后执行的逻辑（Promise 的 catch 回调，如账号密码错误、网络问题等）
        .catch(() => {
          // 登录失败后，把加载状态设为 false，让按钮恢复可点击状态
          loading.value = false
        })
    }
  })
}

function getCookie() {
  const username = Cookies.get('username')
  const password = Cookies.get('password')
  const rememberMe = Cookies.get('rememberMe')
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password: password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
  }
}
getCookie()
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  background-blend-mode: multiply;
  background-image: url('@/assets/login/login-bg.gif');
  background-size: cover;
  background-color: rgba(0, 0, 0, 0.5);
  position: relative;
  &-logo {
    position: absolute;
    top: 32px;
    left: 32px;

    img {
      width: 210px;
      height: 60px;
    }
  }
  &-language {
    position: absolute;
    top: 38px;
    right: 38px;

    :deep(.el-select__wrapper) {
      height: 48px;
      background: #4c4c4c;
      border-radius: 6px;
      box-shadow: none;
    }

    .login-language-label {
      display: flex;
      font-weight: 400;
      font-size: 16px;
      color: #ffffff;

      img {
        width: 24px;
        height: 24px;
        margin-right: 4px;
      }
    }
  }
  &-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;

    &-title {
      font-weight: bold;
      font-size: 42px;
      color: #ffffff;
      line-height: 72px;
      margin-top: 2.5%;
      margin-bottom: 3%;
    }

    &-form {
      width: 28%;
      background: rgba(255, 255, 255, 0.06);
      background-size: 100% 100%;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.5);
      padding: 2% 2%;
      backdrop-filter: blur(17px);
      margin-bottom: 5%;
      .login-container-form-title {
        font-weight: 500;
        font-size: 20px;
        color: #ffffff;
        line-height: 30px;
        text-align: center;
        margin-bottom: 11%;
      }
      .login-container-form-username {
        margin-bottom: 10%;
      }
      .login-container-form-password {
        margin-bottom: 14%;
      }

      .el-input {
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        --el-input-bg-color: rgba(255, 255, 255, 0.1);
        --el-input-border: 1px solid #ffffff;
        --el-input-focus-border: 1px solid #ff4444;
        --el-input-focus-border-color: #ff4444;
        --el-input-height: 26px;

        :deep(.el-input__wrapper) {
          padding: 16px;
        }
        :deep(.el-input__inner) {
          color: #ffffff;
        }
        input {
          height: 50px;
        }
      }

      .input-icon {
        height: 16px;
        width: 16px;
        margin-left: 0px;
        color: #ffffff;
      }

      .el-checkbox {
        font-weight: 400;
        font-size: 16px;
        color: #ffffff;
      }

      .login-container-form-button {
        width: 100%;
        height: 50px;
        background: #e95520;
        border-radius: 4px;
        font-weight: bold;
        font-size: 20px;
        color: #ffffff;
        border-color: #e95520;
      }
    }
  }
  &-copyright {
    position: absolute;
    bottom: 2%;
    font-weight: 400;
    font-size: 12px;
    color: #ffffff;
  }
}
</style>
