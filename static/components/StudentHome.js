const StudentHome = {
  template:`<div>
  This is user page with email id {{UserEmail}}
  <div v-if="category.hasOwnProperty('message')">
    <h1>{{ category['message'] }}</h1>
  </div>
  <table class='table' v-else>
    <thead>
      <tr>
        <th>Seq No</th>
        <th>Category name</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(value, key) in category" :key="key">
        <td>{{ key }}</td>
        <td>{{ value }}</td>
        <td>
          <button class='btn btn-warning' @click="seeProductUser(key,UserEmail)">See Product</button>
        </td>
      </tr>
    </tbody>
  </table>
  <button class='btn btn-warning' @click="Show_Cart()">Show Cart</button>
</div>`,         
  data() {
    return {
      category:{},
      UserEmail:localStorage.getItem('email'),
    }
  },
  methods: {
    fetch_category_for_user:function(){
      const url=`http://127.0.0.1:5000/dashboard/${this.userEmail}`;
        fetch(url).then(response => response.json()).then(data=>{this.category=data}).catch((error)=>{console.log("Error:",error)});
    },
    seeProductUser(id,userEmail){
      console.log(id)
      this.$router.push(`/products/${id}/${userEmail}`);
    },
    Show_Cart:function(){
      const mail=this.UserEmail
      console.log(mail)
      this.$router.push({ name: 'User_cart', params: { userEmail:mail } })
  }
  },
  mounted() {
    this.fetch_category_for_user();
  },
}
 export default StudentHome