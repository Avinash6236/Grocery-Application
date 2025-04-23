const user_products = {
    template:`<div>
    <div v-if="products.hasOwnProperty('message')">
      <h1>{{ products['message'] }}</h1>
    </div>
    <div v-else>
      <div class="row">
        <div class="col-md-4" v-for="(value, key) in products" :key="key">
          <div class="card mb-4">
            <img :src="value['image_url']" class="card-img-top" alt="Product Image">
            <div class="card-body">
              <h5 class="card-title">{{ value["product_name"] }}</h5>
              <p class="card-text">
                <strong>Manufacture Date:</strong> {{ value["manufacture_date"] }}<br>
                <strong>Expiry Date:</strong> {{ value["expiry_date"] }}<br>
                <strong>Rate:</strong> {{ value["rate"] }}<br>
                <strong>Unit:</strong> {{ value["unit"] }}<br>
                <strong>Quantity:</strong> {{ value["quantity"] > 0 ? value["quantity"] : 'Out of Stock' }}
              </p>
              <button type="button" class="btn btn-success" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="top" data-bs-content="One unit added" @click="addCart_product(key)">
                {{ btn_msg }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="btn btn-warning" @click="Show_Cart()">Show Cart</button>
  </div>
  `,  
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
       console.log(this.UserEmail)
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
    $('[data-bs-toggle="popover"]').popover();
  },
}

export default user_products
