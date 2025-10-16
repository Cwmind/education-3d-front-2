import { login, logout, getInfo, modifyUser } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { isHttp, isEmpty } from '@/utils/validate'
import defAva from '@/assets/images/profile.png'

const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    userInfo: {},
    avatar: '',
    roles: []
  }),
  actions: {
    // 登录
    login(userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      return new Promise((resolve, reject) => {
        const params = {
          userName: username,
          password: password
        }
        login(params)
          .then((res) => {
            const { code, response } = res
            if (code === 1) {
              const { token } = response
              setToken(token)
              this.token = token
              resolve()
            } else {
              reject(res)
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res) => {
            const { code, response } = res
            if (code === 1) {
              let avatar = response.avatar || ''
              if (!isHttp(avatar)) {
                avatar = isEmpty(avatar) ? defAva : import.meta.env.VITE_APP_BASE_API + avatar
              }
              const { role, userUuid, userName } = response
              if (role && Array.isArray(role)) {
                this.roles = role
              } else if (role) {
                this.roles = [role]
              } else {
                this.roles = []
              }
              this.userInfo = response
              this.avatar = avatar
              resolve(response)
            } else {
              reject(res)
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    updateUserInfo(params) {
      return new Promise((resolve, reject) => {
        modifyUser(params)
          .then((res) => {
            if (res.code === 1) {
              this.getInfo()
              resolve(res)
            } else {
              reject(res)
            }
          })
          .catch((err) => {
            reject()
          })
      })
    },
    // 退出系统
    logOut() {
      return new Promise((resolve, reject) => {
        logout(this.token)
          .then(() => {
            this.token = ''
            this.roles = []

            removeToken()
            resolve()
          })
          .catch((error) => {
            this.token = ''
            this.roles = []

            removeToken()
            reject(error)
          })
      })
    }
  }
})

export default useUserStore
