// 单点登录相关逻辑
export const appCode = 'TEST' // appCode 需要在MoM里面配置后可以跳转
export const formMomURLStr = '/aiipctest' // 带此后缀表示是从mom跳转过来的 登出时返回mom
export const requestPrefix = '/aiipciot/prod-api' // 单点登录时 后端地址前缀

export function isFromMom(){
  return window.location.href.includes(formMomURLStr)
}

export function goToMom() {
  const windowsLocation = window.location.href
  if(windowsLocation.includes(formMomURLStr)){
    let redirectUrl = ''
    if(getSubstringBefore(windowsLocation,'/login')){
      redirectUrl = getSubstringBefore(windowsLocation,'/login')
    }else{
      redirectUrl = getSubstringBefore(windowsLocation,formMomURLStr)+formMomURLStr
    }
    window.location.href = getSubstringBefore(windowsLocation,formMomURLStr)+`/#/login?appCode=${appCode}&isRedirect=true&redirect=`+redirectUrl
    return false
  }
}

export function getSubstringBefore(str, target) {
  const index = str.indexOf(target);
  if (index === -1) {
    return ''; // 如果目标字符串不存在，返回空字符串
  }
  return str.substring(0, index); // 获取目标字符串之前的部分
}
