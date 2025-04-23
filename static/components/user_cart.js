const user_cart = {
    template:`<div>
    <div v-if="cart_products.hasOwnProperty('message')">
        <h1>{{ cart_products['message'] }}</h1>
    </div>
    <div v-else>
        <div class="row">
            <div v-for="(value, key) in cart_products" :key="key" class="col-md-3 mb-3">
                <div class="card">
                    <div class="card-header">
                    <strong>{{ value["product_name"] }}</strong>
                    </div>
                    <div class="card-body">
                        <p class="card-text">
                            <p>Manufacture Date:</p> {{ value["manufacture_date"] }}
                            <p>Expiry Date:</p> {{ value["expiry_date"] }}
                            <strong>Rate:</strong> {{ value["rate"] }}<br>
                            <strong>Unit:</strong> {{ value["unit"] }}<br>
                            <strong>Quantity:</strong>
                            <span v-for="(value_,key_) in cart_data" :key="key_" v-if="IsProductMatchCartQuantity(value_['product_id'],value['product_id'])">
                                {{ value_["quantity"] }}
                            </span><br>
                            <button class="btn btn-danger" @click="RemoveProductFromCart(value['product_id'])">Remove</button>
                            <button class="btn btn-warning" @click="Edit_quantity(value['product_id'])">+/-</button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <button class="btn btn-success" @click="sendToPurchase()">Purchase</button>
    </div>
</div>

`,
    data() {
        return {
            error:null,
            cart_data:null,
            user_email:localStorage.getItem('email'),
            cart_products:null,

        }
    }, 
    methods: {

        fetch_cart_for_user:function(){
            const url=`http://127.0.0.1:5000/see_cart/${this.user_email}`;
              fetch(url).then(response => response.json()).then(data=>{this.cart_data=data}).catch((error)=>{console.log("Error:",error)});
        },
        fetch_product_from_user_cart:function(){
            const url=`http://127.0.0.1:5000/see_cart_product/${this.user_email}`;
              fetch(url).then(response => response.json()).then(data=>{this.cart_products=data}).catch((error)=>{console.log("Error:",error)});
        },

        async RemoveProductFromCart(product_id){
            const user_email_ = this.user_email
            try{
             const response = await fetch(`http://127.0.0.1:5000/remove_product_from_cart/${user_email_}/${product_id}`,{
                 method:'POST',
             });
             const data = await response.json()
             if (response.ok) {
                window.location.reload();
                //this.$router.push({name:'User_cart', params:{user_email_}}); 
             } else {
                this.error = data.message
                console.error('Failed to delete from cart');
             }
            }catch (error){
             console.error('Error:', error);
            }
     
        },  
        Edit_quantity(product_id){
            const user_email_ = this.user_email
            this.$router.push({name:'Edit_From_Cart',params:{user_email_ , product_id}});
        },
        sendToPurchase(){
            const user_email__ = this.user_email
            this.$router.push({name:'purchase',params:{userEmail:user_email__}});
        },
        
    },
    computed:{
        IsProductMatchCartQuantity(){
            return (value_, value) => {
                console.log(value_,value);
                return value_ === value;
              };

        }
    },
     
    mounted() {
        console.log(this.user_email)
        this.fetch_cart_for_user();
        this.fetch_product_from_user_cart();
    },
     

}

export default  user_cart
