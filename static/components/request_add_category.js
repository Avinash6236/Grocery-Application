const request_add_category = {
    template: `<div>
                <div class='text-danger'>*{{error}}</div>
                <input v-model="category_name" placeholder="category name" />
                <button class='btn btn-warning' @click="Request_new_category_name"> Request Add</button>
             </div>`,
    data() {
        return {
            category_name: null,
            error:null,
            userEmail:localStorage.getItem('email')
        }
    },
    methods: {
        async Request_new_category_name() {
            const mail = this.userEmail
            if(this.category_name){
                try {
                    const response = await fetch(`http://127.0.0.1:5000/Request_create_category/${mail}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            'category_name': this.category_name,
                        }),
                    });
                    const data = await response.json()
                    if (response.ok) {
                        this.$router.push('/managerHome'); 
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
}

export default request_add_category