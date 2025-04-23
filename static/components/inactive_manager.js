

const InactiveManagers={
    template:`<div>
              <div v-if="products.hasOwnProperty('message')">
                <h1>{{ products['message'] }}</h1>
              </div>
              <table class='table' v-else>
              <thead>
                <tr>
                  <th>Seq No</th>
                  <th>Manager email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(value, key) in products" :key="key">
                  <td>{{ key }}</td>
                  <td>{{ value }}</td>
                  <td>
                    <button class='btn btn-success' @click="activate(value)">activate</button>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>`,
  
    data() {
      return {
        products:null,
        message:'',
      }
    }, 
    methods: {
      fetch_inactive_manager:function(){
        const url="http://127.0.0.1:5000/inactive_manager";
        fetch(url).then(response => response.json()).then(data=>{this.products=data}).catch((error)=>{console.error("Error:",error)});
      },
      activate(email){
        console.log(email)
        const url = `http://127.0.0.1:5000/activate/manager/${email}`;
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
              console.log('approved:', result);
    
              // Assuming you want to refresh the manager list after deletion
              this.fetch_inactive_manager();
            })
            .catch((error) => {
              console.error('Error approving manager:', error);
            });
        }
      
    }, 
    mounted() {
      this.fetch_inactive_manager();
    },
   
  }
  
  export default InactiveManagers