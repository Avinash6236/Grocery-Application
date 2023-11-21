const Purchase = {
    template:`<div>
                <div class="container mt-4">
                <h1 class="text-center">Final Payment </h1>
                <div class="table-container">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Rate (per unit)</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                                <tr v-for="(value,key) in data" :key="key" v-if=" key !== 'grandTotal' ">
                                    <td>{{ value['product_name'] }}</td>
                                    <td>{{ value['rate'] }} {{ value['unit'] }}</td>
                                    <td>{{ value['quantity'] }}</td>
                                    <td>{{ value['rate'] * value['quantity'] }}</td>
                                </tr>
                            <tr class="table-primary">
                                <td colspan="3" class="text-end"><strong>Grand Total:</strong></td>
                                <td>{{ data['grandTotal'] }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="payment-box">
                    <p class="h5">To complete your payment:</p>
                    <button class='btn btn-success' @click='pay()'>Pay Now</button>
                </div>
            </div>
        </div>`,
    data(){
        return {
            userEmail:localStorage.getItem('email'),
            data:{},
            msg:'',

        }
    },
    methods: {
        fetch_data:function(){
            const url = `http://127.0.0.1:5000/make_purchase/${this.userEmail}`;
            fetch(url).then(response => response.json()).then(data=>{this.data=data}).catch((error)=>{console.log("Error:",error)});
        },
        pay(){
            const mail = this.userEmail;
            const url =`http://127.0.0.1:5000/payment/${this.userEmail}`;
            fetch(url).then(response=> response.json()).then(data=>{this.msg=data}).catch((error)=>{console.log("Error:",error)});
            this.$router.push({name:'successfullPayment', params:{userEmail:mail}});
        }
    },
    mounted() {
        this.fetch_data();
    },

}

export default Purchase