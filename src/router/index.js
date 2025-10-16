import { ADMIN, TEACHER, STUDENT, ADMIN_TEACHER, ALLROLES } from '@/config/rolesConfig'
import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout'

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  }
  // {
  //   path: '/user',
  //   component: Layout,
  //   hidden: true,
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'profile',
  //       component: () => import('@/views/system/user/profile/index'),
  //       name: 'Profile',
  //       meta: { title: '个人中心', icon: 'user' }
  //     }
  //   ]
  // }
]
// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
  {
    path: '',
    name: 'AdminIndex',
    component: Layout,
    redirect: '/index',
    meta: { title: '首页', affix: true, activeMenu: 'AdminIndex' },
    children: [
      {
        path: '/index',
        name: 'AdminIndex',
        component: () => import('@/views/index/adminIndex/index'),
        roles: ADMIN
      }
    ]
  },
  {
    path: '',
    name: 'TeacherIndex',
    component: Layout,
    redirect: '/index',
    meta: { title: '首页', affix: true, activeMenu: 'TeacherIndex' },
    children: [
      {
        path: '/index',
        name: 'TeacherIndex',
        component: () => import('@/views/index/teacherIndex/index'),
        roles: TEACHER
      }
    ]
  },
  {
    path: '',
    name: 'StudentIndex',
    component: Layout,
    redirect: '/myPractical',
    meta: { title: '我的实训', affix: true, activeMenu: 'StudentIndex' },
    children: [
      {
        path: '/myPractical',
        name: 'MyPractical',
        component: () => import('@/views/practical/myPractical/index'),
        roles: STUDENT
      }
    ]
  },
  {
    path: '/basicManagement',
    name: 'BasicManagement',
    component: Layout,
    meta: { title: '基础管理', activeMenu: 'BasicManagement' },
    children: [
      {
        path: 'studentManagement',
        name: 'StudentManagement',
        component: () => import('@/views/basicManagement/studentManagement/index'),
        roles: ADMIN_TEACHER,
        meta: { title: '学生管理', activeMenu: 'StudentManagement', icon: 'student-management' }
      },
      {
        path: 'classManagement',
        name: 'ClassManagement',
        component: () => import('@/views/basicManagement/classManagement/index'),
        roles: ADMIN_TEACHER,
        meta: { title: '班级管理', activeMenu: 'ClassManagement', icon: 'class-management' }
      },
      {
        path: 'teacherManagement',
        name: 'TeacherManagement',
        roles: ADMIN,
        component: () => import('@/views/basicManagement/teacherManagement/index'),
        meta: { title: '教师管理', activeMenu: 'TeacherManagement', icon: 'teacher-management' }
      }
    ]
  },
  {
    path: '/practical',
    name: 'Practical',
    component: Layout,
    redirect: '/practicalTeaching',
    meta: { title: '实训教学', activeMenu: 'Practical' },
    children: [
      {
        path: '/practicalTeaching',
        name: 'PracticalTeaching',
        component: () => import('@/views/practical/practicalTeaching/index'),
        roles: ADMIN_TEACHER
      }
    ]
  },
  {
    path: '/course',
    name: 'Course',
    component: Layout,
    redirect: '/courseCenter',
    meta: { title: '课程中心', activeMenu: 'Course' },
    children: [
      {
        path: '/courseCenter',
        name: 'CourseCenter',
        component: () => import('@/views/course/courseCenter/index'),
        roles: ADMIN_TEACHER
      }
    ]
  },
  {
    path: '/myCourse',
    name: 'MyCourse',
    component: Layout,
    redirect: '/myCourse',
    meta: { title: '我的课程', activeMenu: 'MyCourse' },
    children: [
      {
        path: '/myCourse',
        name: 'MyCourse',
        component: () => import('@/views/course/myCourse/index'),
        roles: STUDENT
      }
    ]
  },
  {
    path: '/questionBank',
    name: 'QuestionBank',
    component: Layout,
    meta: { title: '题库管理', activeMenu: 'QuestionBank' },
    children: [
      {
        path: 'questionBankInfo',
        name: 'QuestionBankInfo',
        roles: ADMIN_TEACHER,
        component: () => import('@/views/questionBank/questionBankInfo/index'),
        meta: { title: '题库信息', activeMenu: 'QuestionBankInfo', icon: 'question-bank' }
      }
      // {
      //   path: 'paperRules',
      //   name: 'PaperRules',
      //   roles: ADMIN_TEACHER,
      //   component: () => import('@/views/questionBank/paperRules/index'),
      //   meta: { title: '组卷规则', activeMenu: 'PaperRules', icon: 'paper-rules' }
      // }
    ]
  },
  {
    path: '/exam',
    name: 'Exam',
    component: Layout,
    meta: { title: '考试管理', activeMenu: 'ExamManagement' },
    children: [
      {
        path: 'startExam',
        name: 'StartExam',
        roles: ADMIN_TEACHER,
        component: () => import('@/views/exam/startExam/index'),
        meta: { title: '发起考试', activeMenu: 'StartExam', icon: 'start-exam' }
      },
      {
        path: 'examManagement',
        name: 'ExamManagement',
        roles: ADMIN_TEACHER,
        component: () => import('@/views/exam/examManagement/index'),
        meta: { title: '考试管理', activeMenu: 'ExamManagement', icon: 'exam-management' }
      }
    ]
  },
  {
    path: '/myExam',
    name: 'MyExam',
    component: Layout,
    redirect: '/myExam',
    meta: { title: '我的考试', activeMenu: 'MyExam' },
    children: [
      {
        path: '/myExam',
        name: 'MyExam',
        component: () => import('@/views/exam/myExam/index'),
        roles: STUDENT
      }
    ]
  },
  // {
  //   path: '/report',
  //   name: 'Report',
  //   component: Layout,
  //   meta: { title: '日报考勤', activeMenu: 'Report' },
  //   children: [
  //     {
  //       path: 'daily',
  //       name: 'Daily',
  //       roles: ALLROLES,
  //       component: () => import('@/views/report/daily/index'),
  //       meta: { title: '我的日报', activeMenu: 'Daily', icon: 'sys-log' }
  //     },
  //     {
  //       path: 'weekly',
  //       name: 'Weekly',
  //       roles: ALLROLES,
  //       component: () => import('@/views/report/weekly/index'),
  //       meta: { title: '我的周报', activeMenu: 'Weekly', icon: 'sys-log' }
  //     },
  //     {
  //       path: 'dailyManagement',
  //       name: 'DailyManagement',
  //       roles: ADMIN,
  //       component: () => import('@/views/report/dailyManagement/index'),
  //       meta: { title: '日报管理', activeMenu: 'DailyManagement', icon: 'sys-dic' }
  //     },
  //     {
  //       path: 'weeklyManagement',
  //       name: 'WeeklyManagement',
  //       roles: ADMIN,
  //       component: () => import('@/views/report/weeklyManagement/index'),
  //       meta: { title: '周报管理', activeMenu: 'WeeklyManagement', icon: 'sys-dic' }
  //     },
  //     {
  //       path: 'attendance',
  //       name: 'Attendance',
  //       roles: ADMIN,
  //       component: () => import('@/views/report/attendance/index'),
  //       meta: { title: '考勤管理', activeMenu: 'Attendance', icon: 'sys-dic' }
  //     }
  //   ]
  // },
  {
    path: '/system',
    name: 'System',
    component: Layout,
    meta: { title: '系统管理', activeMenu: 'System' },
    children: [
      {
        path: 'sysdic',
        name: 'SysDic',
        roles: ADMIN,
        component: () => import('@/views/system/sysdic/index'),
        meta: { title: '数据字典', activeMenu: 'SysDic', icon: 'sys-dic' }
      },
      {
        path: 'syslog',
        name: 'SysLog',
        roles: ADMIN,
        component: () => import('@/views/system/syslog/index'),
        meta: { title: '操作日志', activeMenu: 'SysLog', icon: 'sys-log' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
