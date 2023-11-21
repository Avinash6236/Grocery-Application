import router from './router.js'
import Navbar from './components/Navbar.js'
import adminHome from './components/AdminHome.js'
import HomeElse from './components/HomeElse.js'

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !localStorage.getItem('auth-token') ? true : false)
    next({ name: 'Login' })
  else next()
}),

new Vue({
  el: '#app',
  template: `<div>
  <Navbar />
  <router-view></router-view>
  </div>
  `,

  data() {
    return {
      studentId:5,
      courseId:5,
    }
  },


  router,

  components: {
    Navbar,
    adminHome,
    HomeElse,
  },
})
