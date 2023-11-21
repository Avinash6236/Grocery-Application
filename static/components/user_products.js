const user_products = {
    template:`<div>
    <h1>Category id: {{category_id}}</h1>
   
    <div v-if="products.hasOwnProperty('message')">
      <h1>{{ products['message'] }}</h1>
    </div>
    <table class='table' v-else>
    <thead>
      <tr>
        <th>Seq No</th>
        <th>Product name</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(value, key) in products" :key="key">
        <td>{{ key }}</td>
        <td>{{ value }}</td>
        <td>
          <button class='btn btn-success' @click="addCart_product(key)">{{btn_msg}}</button>
        </td>
      </tr>
    </tbody>
  </table>
  <button class='btn btn-warning' @click="Show_Cart()">Show Cart</button>
  </div>`,  
  data() {
    return {
      category_id:this.$route.params.id,
      products:{},
      UserEmail:localStorage.getItem('email'),
      error:null,
      btn_msg:'Add To Cart',
    }
  },   
  methods: {
    fetch_product_detail:function(){
        console.log(this.UserEmail)
        const url="http://127.0.0.1:5000/admin_products/" + this.category_id;
        fetch(url).then(response => response.json()).then(data=>{this.products=data}).catch((error)=>{console.error("Error:",error)});
    },
    async addCart_product(id){
       try{
        const response = await fetch(`http://127.0.0.1:5000/add_to_cart/${this.UserEmail}/${id}`,{
            method:'POST',
        });
        const data = await response.json()
        // if (response.ok) {
        //     //this.$router.push('/category/product/' + this.category_id); 
        // } else {
        //     this.error = data.message
        //     console.error('Failed to add in cart');
        // }
       }catch (error){
        console.error('Error:', error);
       }

    },
    Show_Cart:function(){
        const mail=this.UserEmail
        this.$router.push({ name: 'User_cart', params: {userEmail: mail } })
    }
  },
  mounted() {
    
    this.fetch_product_detail();
  },
}

export default user_products
