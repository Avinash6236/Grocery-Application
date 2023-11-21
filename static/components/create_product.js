const create_product = {
    template: `<div>
                <div class='text-danger'>*{{error}}</div>
                <div class=" col d-flex justify-content-center">
                <div class="card p-3" style="width: 18rem;">
                    <form class="row g-3" @submit.prevent="onSubmit">
                    <div class="row-md-6">
                        <div class="input-group">
                        <input type="text" v-model="product_name" class="form-control" placeholder="Product Name" required>
                        </div>
                        <br>
                        <div class="row-md-6">
                        <input type="text" v-model="manufacture_date" class="form-control" placeholder="Manufacture date e.g. dd/mm/yyyy" >
                        </div>
                        <br>
                        <div class="row-md-6">
                        <input type="text" v-model="expiry_date" class="form-control" placeholder="Expiry date e.g. dd/mm/yyyy" >
                        </div>
                        <br>
                        <div class="row-md-6">
                        <select v-model="unit">
                            <option value="Rs/Kg">Rs/Kg</option>
                            <option value="Rs/Litre">Rs/Litre</option>
                            <option value="Rs/gram">Rs/gram</option>
                            <option value="Rs/Dozen">Rs/Dozen</option>
                            <option value="Rs/Item">Rs/Item</option>
                        </select>
                        </div>
                        <br>
                        <div class="row-md-6">
                        <input type="number" v-model="rate" class="form-control" placeholder="Enter Price per unit" required>
                        </div>
                        <br>
                        <div class="row-md-6">
                        <input type="number" v-model="quantity" class="form-control" placeholder="Enter quantity per unit" required>
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
        product_name:'',
        manufacture_date:'',
        expiry_date:'',
        unit:'',
        rate:'',
        category_id:this.$route.params.id,
        quantity:null,
        error:null,
            
        }
    },
    methods: {
        async onSubmit(){
            console.log(this.category_id)
            if (this.product_name && this.unit && this.rate && this.quantity) {
               try{
                const response = await fetch(`http://127.0.0.1:5000/add_product/${this.category_id}`, {
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
                            "category_id":this.category_id,
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
                    this.error = "Please fill all the required fields";
                  }
        },
                
    }
}   

export default create_product;

