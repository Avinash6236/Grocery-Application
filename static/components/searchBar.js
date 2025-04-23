const searchBar = {
    template:`<div>
                   
                   <input v-model="searchTerm" type="text" placeholder="Search...">
                   <button type="button" class="btn btn-outline-info" @click="searchProducts">Search</button>
                   <div v-if="searchResults">
                   
                   <div class="container mt-5">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Manufacture Date</th>
                                    <th>Expiry Date</th>
                                    <th>Unit</th>
                                    <th>Rate</th>
                                    <th>Available stock</th>
                                    <th>Add To Cart</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(value, key) in searchResults" :key="key">
                                    <td>{{ value['product_name'] }}</td>
                                    <td>{{ value['manufacture_date'] }}</td>
                                    <td>{{value['expiry_date'] }}</td>
                                    <td>{{ value['unit'] }}</td>
                                    <td>{{ value['rate'] }}</td>
                                    <td>{{ value['quantity']}}</td>
                                    <td> <button type="button" class="btn btn-outline-success" @click="addCart_product(key)">ADD</button> </td>
                            </tr>  
                            </tbody>
                        </table>
                    </div>
                   
                   </div>
             </div>`,
    data() {
        return {
            searchTerm:'',
            searchResults:null,
            email_id: localStorage.getItem('email')
        }
    },  
    methods: {
        searchProducts() {
            this.searchResults = null;
            // Make a request to the Flask backend with the search term
            const url = `http://127.0.0.1:5000/search?term=${this.searchTerm}`;
            
            fetch(url)
              .then(response => response.json())
              .then(data => {
                this.searchResults = data;
                console.log(data)
              })
              .catch(error => {
                console.error('Error fetching search results:', error);
              });
          },
          async addCart_product(id){
            console.log(this.email_id)
            try{
             const response = await fetch(`http://127.0.0.1:5000/add_to_cart/${this.email_id}/${id}`,{
                 method:'POST',
             });
             const data = await response.json()
            }catch (error){
             console.error('Error:', error);
            }
    },       
}
}
export default searchBar