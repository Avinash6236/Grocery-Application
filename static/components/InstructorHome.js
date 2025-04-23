
const TrueAdmin = {
  template: `<div>
  This is True admin page
  <router-link to="/inbox">Approve Requests</router-link>
  <div v-if="category.hasOwnProperty('message')">
    <h1>{{ category['message'] }}</h1>
  </div>
  <table class='table' v-else>
    <thead>
      <tr>
        <th>Seq No</th>
        <th>Category name</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(value, key) in category" :key="key">
        <td>{{ key }}</td>
        <td>{{ value }}</td>
        <td>
          <button class='btn btn-danger' @click="DeleteProductAdmin(key)">Remove</button>
          <button class='btn btn-success' @click="edit_category(key)">Edit Category</button>
        </td>
      </tr>
    </tbody>
  </table>
  <button class='btn btn-success' @click="add_category()">Add Category</button>
  
</div>`,
  data(){
      return {
          category:null,
          userEmail:localStorage.getItem('email'),
      }
  },
  
  methods: {
    fetch_category_detail:function(){
        const url="http://127.0.0.1:5000/admin_dashboard/" + this.userEmail;
        fetch(url).then(response => response.json()).then(data=>{this.category=data}).catch((error)=>{console.log("Error:",error)});
    },
    DeleteProductAdmin(id){
        const url = `http://127.0.0.1:5000/category/${id}/delete`;

      fetch(url, {
        method: 'POST',
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
          this.fetch_category_detail();
        })
        .catch((error) => {
          console.error('Error deleting product:', error);
        });
    },
    add_category(){
      this.$router.push('/create_category');
    },
    edit_category(id){
      this.$router.push(`/admin_edit_category/${id}`);
    },
  },
  
  mounted() {
    this.fetch_category_detail();
  },
}

export default TrueAdmin

