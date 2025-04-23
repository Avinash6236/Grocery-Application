const StudentHome = {
  template: `<div>
  <div v-if="category.hasOwnProperty('message')">
    <h1>{{ category['message'] }}</h1>
  </div>
  <ul class="nav justify-content-end">
    <li class="nav-item">
      <button class='btn btn-warning' @click="Show_Cart()">Show Cart</button>
    </li>
    <li class="nav-item ms-2">
      <router-link type="button" class="btn btn-warning" to="/search">Search</router-link>
    </li>
  </ul>

  <div class="container text-center mt-3 ms-2">
    <div class="row justify-content-around mt-2">
      <div v-for="(item, index) in category" :key="index" class="col-md-4 mb-3">
        <div class="card text-bg-success mb-3" style="max-width: 18rem;">
          <img :src="getImageUrl(item)" class="img-fluid rounded-circle" alt="..." style="width: 100px; height: 100px;">
          <div class="card-header">{{ item }}</div>
          <div class="card-body">
            <button class='btn btn-warning' @click="seeProductUser(index, UserEmail)">See Product</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`,
  data() {
    return {
      category: {},
      UserEmail: localStorage.getItem('email'),
    }
  },
  methods: {
    fetch_category_for_user: function () {
      const url = `http://127.0.0.1:5000/dashboard/${this.userEmail}`;
      fetch(url)
        .then(response => response.json())
        .then(data => { this.category = data })
        .catch((error) => { console.log("Error:", error) });
    },
    seeProductUser(id, userEmail) {
      console.log(id);
      this.$router.push(`/products/${id}/${userEmail}`);
    },
    Show_Cart: function () {
      const mail = this.UserEmail;
      console.log(mail);
      this.$router.push({ name: 'User_cart', params: { userEmail: mail } });
    },

    getImageUrl(category) {
      // Return the image URL or path based on the category
      // Example: You might have a mapping of categories to image URLs
      const categoryImageMap = {
        'Vegetables': '/static/Vegetables1.png',
        'Sports':'/static/Sports.png',
        'Medicines':'/static/Medicines.png',
        'Fruits':'/static/Fruits.png',
        'Dairy':'/static/Dairy.png',
        // Add more categories and their corresponding image URLs
      };
      return categoryImageMap[category] || '/static/default-category.png'; // Default image if category not found
    },
  },
  mounted() {
    this.fetch_category_for_user();
  },
};
export default StudentHome;




//  <table class='table' v-else>
//     <thead>
//       <tr>
//         <th>Seq No</th>
//         <th>Category name</th>
//         <th>Action</th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr v-for="(value, key) in category" :key="key">
//         <td>{{ key }}</td>
//         <td>{{ value }}</td>
//         <td>
//           <button class='btn btn-warning' @click="seeProductUser(key,UserEmail)">See Product</button>
//         </td>
//       </tr>
//     </tbody>
//   </table>
