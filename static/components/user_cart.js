const user_cart = {
    template:`<div>
                 <div v-if="cart_products.hasOwnProperty('message')">
                    <h1>{{ cart_products['message'] }}</h1>
                </div>
                <table class='table' v-else>
                    <thead>
                    <tr>
                        <th>Seq No</th>
                        <th>Product name</th>
                        <th>Manufacture Date</th>
                        <th>Expiry Date</th>
                        <th>Rate</th>
                        <th>Unit</th>
                        <th>quantity</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(value, key) in cart_products" :key="key">
                        <td>{{ key }}</td>
                        <td>{{ value["product_name"] }}</td>
                        <td>{{ value["manufacture_date"] }}</td>
                        <td>{{ value["expiry_date"] }}</td>
                        <td>{{value["rate"]}}</td>
                        <td>{{value["unit"]}}</td>
                        <td v-for="(value_,key_) in cart_data" :key="key_" v-if="IsProductMatchCartQuantity(value_['product_id'],value['product_id'])" > {{value_["quantity"]}} </td>
                        <td>
                        <button class='btn btn-danger' @click="RemoveProductFromCart(value['product_id'])" >Remove</button>
                        <button class='btn btn-warning' @click="Edit_quantity(value['product_id'])">Edit</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <button class='btn btn-success' @click="sendToPurchase()">Purchase</button>
              </div>`,
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
