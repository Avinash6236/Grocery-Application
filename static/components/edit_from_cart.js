const edit_from_cart = {
    template:`<div class="d-flex justify-content-center align-items-center vh-50">
                <div class='text-danger'>{{error}}</div>
                <div class='card' style="width: 18rem;">
                    <form class="row g-3" @submit.prevent="onSubmit">
                        <label>Choose the quantity</label>
                        <div class="input-group mb-3">
                        <input type="number" class="form-control" v-model="new_quantity" aria-describedby="button-addon2" :min="1" :max="products['quantity']" >
                        <button class="btn btn-outline-success" type="submit">submit</button>
                        </div>
                    </form>
                </div> 
                  
              </div>`,

    data() {
        return {
            previous_quantity:null,
            user_email:this.$route.params.user_email_,
            product_id:this.$route.params.product_id,
            new_quantity:null,
            products:null,
            error:'',
        }
    },
              
    methods: {
        async onSubmit(){
            const userEmail = this.user_email
            try{
            const response = await fetch(`http://127.0.0.1:5000/edit_product_from_cart/${this.user_email}/${this.product_id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "quantity":this.new_quantity,
                    }),
                });
                const data = await response.json()
                if (response.ok) {
                    this.$router.push({name:'User_cart', params:{userEmail}}); 
                } else {
                    this.error = data.message
                    console.error('Failed to add category');
                }
            } catch (error) {
                console.error('Error:', error);
                } 
        },
        fetch_product_record:function() {
            const prod_id=this.product_id
            const url = `http://127.0.0.1:5000/fetch_product_record/${prod_id}`;
            fetch(url).then(response => response.json()).then(data=>{this.products=data}).catch((error)=>{console.error("Error:",error)});
        }

    }, 
    mounted() {
        this.fetch_product_record();
    },         
}

export default edit_from_cart

 