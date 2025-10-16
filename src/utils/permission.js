import useUserStore from '@/store/modules/user'

/**
 * 角色权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkRole(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = useUserStore().roles
    const permissionRoles = value

    const hasRole = roles.some((role) => {
      return permissionRoles.includes(role)
    })

    if (!hasRole) {
      return false
    }
    return true
  } else {
    return false
  }
}
