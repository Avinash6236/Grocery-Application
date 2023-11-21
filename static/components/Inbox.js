const Inbox = {
    template:`<div>
                   <h1>Show all the Manager requests here</h1>
                   <h1 v-if="data.hasOwnProperty('messsage')">{{data['messsage']}}</h1>
                   <table class='table' v-else>
                    <thead>
                    <tr>
                        <th>Email</th>
                        <th>Type of Request</th>
                        <th>Action to take on ID</th>
                        <th>Input Name</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(value, key) in data" :key="key">
                        <td>{{ value['email'] }}</td>
                        <td>{{ value['type_of'] }}</td>
                        <td>{{value['actionID']}}</td>
                        <td>{{value['actionInput']}}</td>
                        <td v-if="value['type_of']=='delete'">
                        <button class='btn btn-danger' @click="approve_delete(value['actionID'],value['type_of'],value['actionInput'])">Approve Delete</button>
                        <button class='btn btn-warning' @click="seeProductAdmin(key)">Reject</button>
                        </td>
                        <td v-if="value['type_of']=='add' ">
                        <button class='btn btn-success' @click="approve_add(value['actionInput'])">Approve Add</button>
                        <button class='btn btn-warning' @click="seeProductAdmin(key)">Reject</button>
                        </td>
                        <td v-if="value['type_of']=='edit' ">
                        <button class='btn btn-primary' @click="approve_edit(value['actionID'],value['actionInput'])">Approve Edit</button>
                        <button class='btn btn-warning' @click="seeProductAdmin(key)">Reject</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
              </div>`,
    data(){
        return {
            data:{}
        }
    },
    methods: {
        fetch_inbox_requests:function(){
            const url="http://127.0.0.1:5000/all_requests";
            fetch(url).then(response => response.json()).then(data=>{this.data=data}).catch((error)=>{console.log("Error:",error)});
        },
        approve_delete(id,action,input_data){
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
                this.fetch_inbox_requests();
              })
              .catch((error) => {
                console.error('Error deleting product:', error);
              });
        },
        async approve_add(actionInput) {
            if(actionInput){
                try {
                    const response = await fetch(`http://127.0.0.1:5000/create_category_approve`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            'category_name': actionInput,
                        }),
                    });
                    const data = await response.json()
                    if (response.ok) {
                        this.fetch_inbox_requests();
                        this.$router.push('/inbox'); 
                    } else {
                        this.error = data.message
                        console.error('Failed to add category');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
            else{
                this.error = 'Please enter valid category name';
            } 
        },
        async approve_edit(id,actionInput) {
            if(id){
                try {
                    const response = await fetch(`http://127.0.0.1:5000/edit_category_approve/${id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            'category_name': actionInput,
                        }),
                    });
                    const data = await response.json()
                    if (response.ok) {
                        this.fetch_inbox_requests();
                        this.$router.push('/inbox'); 
                    } else {
                        this.error = data.message
                        console.error('Failed to add category');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
            else{
                this.error = 'Please enter valid category name';
            } 
        },
    }, 
    mounted() {
        this.fetch_inbox_requests();
    },         
}

export default Inbox