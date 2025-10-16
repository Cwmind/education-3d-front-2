import hasRole from './permission/hasRole'
import copyText from './common/copyText'

export default function directive(app) {
  app.directive('hasRole', hasRole)
  app.directive('copyText', copyText)
}
