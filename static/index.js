import router from './router.js'
import Navbar from './components/Navbar.js'
import managerHome from './components/managerHome.js'
import HomeElse from './components/HomeElse.js'
import pick_to_register from './components/pick_to_register.js'

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !localStorage.getItem('auth-token') ? true : false)
    if (to.name === 'register_page' || (to.name === 'registration') ){
      next();
    }else{
      next({ name: 'Login' })
    } 
  else next()
}),

new Vue({
  el: '#app',
  template: `<div>
  <Navbar :key="$route.path" />
  <router-view></router-view>
  </div>
  `,

  data() {
    return {
      
    }
  },


  router,

  components: {
    Navbar,
    managerHome,
    HomeElse,
    pick_to_register,
  },
})
