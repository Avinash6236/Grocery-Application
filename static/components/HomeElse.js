

const HomeElse={
  template:`<div>
            <div v-if="products.hasOwnProperty('message')">
              <h1>{{ products['message'] }}</h1>
            </div>
            <table class='table' v-else>
            <thead>
              <tr>
                <th>Product name</th>
                <th>Manufacture date</th>
                <th>expiry date</th>
                <th>unit</th>
                <th>rate</th>
                <th> quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(value, key) in products" :key="key">
                <td>{{ value['product_name'] }}</td>
                <td>{{value['manufacture_date']}}</td>
                <td>{{value['expiry_date']}}</td>
                <td>{{value['unit']}}</td>
                <td>{{value['rate']}}</td>
                <td>{{value['quantity']}}</td>
                <td>
                  <button class='btn btn-warning' @click="edit_product(key)">Edit Product</button>
                  <button class='btn btn-danger' @click="delete_product(key)">Remove Product</button>
                </td>
              </tr>
            </tbody>
          </table>
          <button class='btn btn-success' @click="add_product">Add Product</button>
          </div>`,

  data() {
    return {
      category_id:this.$route.params.id,
      products:null,
    }
  }, 
  methods: {
    fetch_product_detail:function(){
      const url="http://127.0.0.1:5000/admin_products/" + this.category_id;
      fetch(url).then(response => response.json()).then(data=>{this.products=data}).catch((error)=>{console.error("Error:",error)});
  },
    edit_product(id){
      this.$router.push({
        name: 'Edit_Product', 
        params: { id: id },
        query: { category_id: this.category_id }
      });
    },
    add_product(){
      this.$router.push('/add_product/' + this.category_id);
    },
    
    delete_product(id){
      const url = `http://127.0.0.1:5000/product/${id}/delete`;

      fetch(url, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((result) => {
          console.log('Product deleted successfully:', result);

          // Assuming you want to refresh the product list after deletion
          this.fetch_product_detail();
        })
        .catch((error) => {
          console.error('Error deleting product:', error);
        });
    }
  }, 

  mounted() {
    this.fetch_product_detail();
  },
}

export default HomeElse