import Home from './components/Home.js'
import Login from './components/Login.js'
import Users from './components/Users.js'
import HomeElse from './components/HomeElse.js'
import EditProduct from './components/EditProduct.js'
import DeleteProductAdmin from './components/DeleteProductAdmin.js'
import create_category from './components/create_category.js'
import managerHome from './components/managerHome.js'
import create_product from './components/create_product.js'
import user_products from './components/user_products.js'
import user_cart from './components/user_cart.js'
import edit_from_cart from './components/edit_from_cart.js'
import Purchase from './components/purchase.js'
import SuccessfullPayment from './components/SuccessfullPayment.js'
import Inbox from './components/Inbox.js'
import TrueAdmin from './components/InstructorHome.js'
import request_add_category from './components/request_add_category.js'
import request_edit_category from './components/request_edit_category.js'
import report_file from './components/report_file.js'
import pick_to_register from './components/pick_to_register.js'
import register_form from './components/register_form.js'
import InactiveManagers from './components/inactive_manager.js'
import searchBar from './components/searchBar.js'
import admin_edit_category from './components/admin_edit_category.js'


const routes = [
  { path: '/', component: Home, name: 'Home' },
  { path: '/login', component: Login, name: 'Login' },
  { path: '/users', component: Users },
  { path:'/category/product/:id',component:HomeElse },
  { path:'/edit_product/:id',component:EditProduct, name:'Edit_Product' },
  { path:'/DeleteProductAdmin', component:DeleteProductAdmin },
  { path:'/create_category', component:create_category },
  { path:'/managerHome', component:managerHome},
  { path:'/add_product/:id',component:create_product},
  { path:'/products/:id/:userEmail',component:user_products, name:'User_Product'},
  { path:'/see_cart/:userEmail',component:user_cart,name:'User_cart'},
  { path:'/edit_product_from_cart/:user_email_/:product_id',component:edit_from_cart,name:'Edit_From_Cart'},
  { path:'/purchase_from_cart/:userEmail',component:Purchase,name:'purchase'},
  { path:'/sucessfull_payment/:userEmail',component:SuccessfullPayment,name:'successfullPayment'},
  {path:'/inbox',component:Inbox,name:'inbox_'},
  {path:'/InstructorHome',component:TrueAdmin},
  {path:'/request_add_category/',component:request_add_category},
  {path:'/request_edit_category/:id',component:request_edit_category },
  {path:'/see_report',component:report_file },
  {path:'/register',component:pick_to_register,name:'register_page'},
  {path: '/register/:ROLE',component:register_form,name:'registration'},
  {path: '/activate_managers', component:InactiveManagers},
  {path: '/search',component:searchBar},
  {path: '/admin_edit_category/:id',component:admin_edit_category},

]

export default new VueRouter({
  routes,
})
