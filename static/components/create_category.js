const create_category = {
    template: `<div>
                <div class='text-danger'>*{{error}}</div>
                <input v-model="category_name" placeholder="category name" />
                <button class='btn btn-warning' @click="fetch_new_category_name_to_backend">Add</button>
             </div>`,
    data() {
        return {
            category_name: null,
            error:null,
            userEmail:localStorage.getItem('email')
        }
    },
    methods: {
        async fetch_new_category_name_to_backend() {
            const mail = this.userEmail
            if(this.category_name){
                try {
                    const response = await fetch(`http://127.0.0.1:5000/create_category`, {
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
                        this.$router.push('/InstructorHome'); 
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

export default create_category;
