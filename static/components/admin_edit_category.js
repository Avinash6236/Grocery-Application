const admin_edit_category = {
    template: `<div>
                <div class='text-danger'>*{{error}}</div>
                    <form class="row g-3" @submit.prevent="onSubmit">
                    <div class="row-md-6">
                        <div class="input-group">
                        <label>Category Name</label>
                        <input type="text" v-model="category_name" class="form-control" :placeholder=" category_details.category_name " >    
                    </div>
                    </div>
                    <div class="row-12 d-flex justify-content-center">
                        <button class="btn btn-outline-secondary" type="submit">save</button>
                    </div>   
                    </form>  
                </div>  
             </div>`,
    data() {
        return {
        category_name:'',
        error:'',
        category_id:this.$route.params.id,
        userEmail:localStorage.getItem('email'),
        category_details:''
        }
    },
    methods: {

        fetch_category_detail:function(){
            const url="http://127.0.0.1:5000/give_category_from_id/" + this.category_id;
            fetch(url).then(response => response.json()).then(data=>{this.category_details=data}).catch((error)=>{console.log("Error:",error)});
        },
        
        async onSubmit(){
            console.log(this.category_id)
            if (this.category_name) {
               try{
                const response = await fetch(`http://127.0.0.1:5000/edit_category_from_admin/${this.category_id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            "category_name": this.category_name,
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
            } else{
                this.$router.push('/InstructorHome'); 
                  }
        },
                
    },
    mounted() {
        this.fetch_category_detail();
    },
}   

export default admin_edit_category;

