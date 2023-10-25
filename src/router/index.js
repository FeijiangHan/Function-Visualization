import Vue from 'vue'
import Router from 'vue-router'
// import Register from '@/components/Register'
// import Answer from '@/components/Answer'
// import Test from '@/components/Test'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path:'/Register',
      // component:Register
      component: ()=> import('@/components/Register')
    },
    {
      path:'/Answer',
      //component: Answer
      component: ()=> import('@/components/Answer')
    },
    {
      path:'/Test',
      //component: Test
      component: ()=> import('@/components/Test')
    },
    {
      path:'/',
      redirect: '/Register'
    }
  ]
})
