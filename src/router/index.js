import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: resolve => require(['@/pages/home/index'], resolve)
    },
    {
      path: '/category',
      name: 'category',
      component: resolve => require(['@/pages/category/index'], resolve)
    },
    {
      path: '/list',
      name: 'list',
      component: resolve => require(['@/pages/list/index'], resolve)
    },
    {
      path: '/mine',
      name: 'mine',
      component: resolve => require(['@/pages/mine/index'], resolve)
    },
    {
      path: '/cars',
      name: 'cars',
      component: resolve => require(['@/pages/car/index'], resolve)
    },
    {
      path: '/detail',
      name: 'detail',
      component: resolve => require(['@/pages/car/detail'], resolve)
    },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/pages/login/index'], resolve)
    },
    {
      path: '/appointment',
      name: 'appointment',
      component: resolve => require(['@/pages/appointment/index'], resolve)
    },
    {
      path: '/search',
      name: 'search',
      component: resolve => require(['@/pages/car/search'], resolve)
    }
  ]
})
router.beforeEach((to, from, next) => {
  // to: Route: 即将要进入的目标 路由对象
  // from: Route: 当前导航正要离开的路由
  // next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
  const nextRoute = ['list', 'appointment']
  let isLogin = localStorage.getItem('userInfo') // 获取客户信息
  // 未登录状态；当路由到nextRoute指定页时，跳转至login
  if (nextRoute.indexOf(to.name) >= 0) {
    // console.log(to)
    // console.log(from)
    if (!isLogin) {
      router.push({ name: 'login', query: { from: to.path } })
    }
  }
  next()
})
export default router
