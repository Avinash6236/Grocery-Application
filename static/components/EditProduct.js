const EditProduct = {
    template: `<div>
                <div class='text-danger'>*{{error}}</div>
                <div class=" col d-flex justify-content-center">
                <div class="card p-3" style="width: 18rem;">
                    <form class="row g-3" @submit.prevent="onSubmit">
                    <div class="row-md-6">
                        <div class="input-group">
                        <label>Product Name</label>
                        <input type="text" v-model="product_name" class="form-control" :placeholder=" product_details.product_name" >
                        </div>
                        <br>
                        <div class="row-md-6">
                        <label>manufacture date</label>
                        <input type="text" v-model="manufacture_date" class="form-control" :placeholder="product_details.manufacture_date" >
                        <span class="text-muted">Format: dd/mm/yyyy</span>
                        </div>
                        <br>
                        <div class="row-md-6">
                        <label>expiry date</label>
                        <input type="text" v-model="expiry_date" class="form-control" :placeholder=" product_details.expiry_date" >
                        </div>
                        <br>
                        <div class="row-md-6">
                        <label>unit</label>
                        <select v-model="unit" :placeholder=" product_details.unit">
                            <option value="Rs/Kg">Rs/Kg</option>
                            <option value="Rs/Litre">Rs/Litre</option>
                            <option value="Rs/gram">Rs/gram</option>
                            <option value="Rs/Dozen">Rs/Dozen</option>
                            <option value="Rs/Item">Rs/Item</option>
                        </select>
                        </div>
                        <br>
                        <div class="row-md-6">
                        <label>rate</label>
                        <input type="number" v-model="rate" class="form-control" :placeholder=" product_details.rate" >
                        </div>
                        <br>
                        <div class="row-md-6">
                        <label>quantity</label>
                        <input type="number" v-model="quantity" class="form-control" :placeholder="product_details.quantity" >
                        </div>
                        <br>
                        <div class="row-12 d-flex justify-content-center">
                        <button class="btn btn-outline-secondary" type="submit">save</button>
                        </div>
                    </div>
                    </form>
                </div>
                </div>
             </div>`,
    data() {
        return {
        product_name:null,
        manufacture_date:null,
        expiry_date:null,
        unit:null,
        rate:null,
        category_id:this.$route.query.category_id,
        quantity:null,
        error:null,
        product_details:null,
        product_id:this.$route.params.id,
        error:null,
        }
    },
    methods: {

        fetch_product_detail:function(){
            const url="http://127.0.0.1:5000/fetch_product_record/" + this.product_id;
            fetch(url).then(response => response.json()).then(data=>{this.product_details=data}).catch((error)=>{console.error("Error:",error)});
        },
        
        async onSubmit(){
            console.log(this.category_id)
            if (this.product_name || this.unit || this.rate || this.quantity || this.manufacture_date || this.expiry_date) {
               try{
                const response = await fetch(`http://127.0.0.1:5000/edit_product/${this.product_id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            "product_name": this.product_name,
                            "manufacture_date": this.manufacture_date,
                            "expiry_date": this.expiry_date,
                            "unit": this.unit,
                            "rate": this.rate,
                            "quantity":this.quantity,
                        }),
                    });
                    const data = await response.json()
                    if (response.ok) {
                        this.$router.push('/category/product/' + this.category_id); 
                    } else {
                        this.error = data.message
                        console.error('Failed to add category');
                    }
               } catch (error) {
                console.error('Error:', error);
                 }
            } else{
                this.$router.push('/category/product/' + this.category_id); 
                  }
        },
                
    },
    mounted() {
        this.fetch_product_detail();
    },
}   

export default EditProduct;

