
const managerHome = {
  template: `<div>
  This is Manager page
  <div v-if="category.hasOwnProperty('message')">
    <h1>{{ category['message'] }}</h1>
    <button class='btn btn-success' @click="request_add_category()">Request Add Category</button>
  </div>
  <div v-if="category.hasOwnProperty('message2')">
    <h1>{{ category['message2'] }}</h1>
  </div>
  <div v-else>
  <table class='table'>
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
          <button class='btn btn-warning' @click="seeProductAdmin(key)">See Product</button>
          <button class='btn btn-danger' @click="DeleteProductAdmin(key)">Request Remove</button>
          <button class='btn btn-danger' @click="request_edit_category(key)">Request Edit</button>
        </td>
      </tr>
    </tbody>
  </table>
  <button class='btn btn-success' @click="request_add_category()">Request Add Category</button>
  </div>
</div>`,
  
  props:['studentId','courseId'],

  data(){
      return {
          student:{
              firstName: 'Shristi',
              lastName: 'Yadav',
              relation: 'My last crush'
          },
          category:{},
          userEmail:localStorage.getItem('email')
      }
  },
  
  methods: {
    fetch_category_detail:function(){
        const url="http://127.0.0.1:5000/admin_dashboard/" + this.userEmail;
        fetch(url).then(response => response.json()).then(data=>{this.category=data}).catch((error)=>{console.log("Error:",error)});
    },
    seeProductAdmin(id){
  
        this.$router.push('/category/product/' + id);
    },
    DeleteProductAdmin(id){
      const mail = this.userEmail;
      const url = `http://127.0.0.1:5000/category/${id}/delete/${mail}`;

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
    request_add_category(){
      this.$router.push('/request_add_category');
    },
    request_edit_category(id){
      const mail = this.userEmail;
      this.$router.push(`/request_edit_category/${id}`);
    }
  },
  
  mounted() {
    this.fetch_category_detail();
  },

  computed:{
      fullname(){
          return this.student.firstName + ' ' + this.student.lastName
      }
  }
}

export default managerHome
