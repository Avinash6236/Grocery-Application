const register_form = {
    template:`<div>
    {{fresh.role_}}
        <div class='d-flex justify-content-center' style="margin-top: 25vh">
            <div class="mb-3 p-5 bg-light">
                <div class='text-danger'>{{error}}</div>

                <label for="user-name" class="form-label">User Name</label>
                <input type="string" class="form-control" id="user-name" placeholder="" v-model="fresh.user_name">

                <label for="user-email" class="form-label">Email Address</label>
                <input type="email" class="form-control" id="user-email" placeholder="name@example.com" v-model="fresh.email">

                <label for="user-password" class="form-label">Password</label>
                <input type="password" class="form-control" id="user-password" v-model="fresh.password">
                <button class="btn btn-primary mt-2" @click='do_registration'>Sign Up</button>
            </div>
        </div>    
    </div>`,
    data() {
        return {
            
            fresh:{
                email:'',
                password:'',
                user_name:'',
                role_:this.$route.params.ROLE,
            },
            error:'',
           
        }
    },  
    methods: {
        async do_registration() {
            const res = await fetch('/do_registration', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(this.fresh),
            })
            const data = await res.json()
            if (res.ok) {
              this.$router.push({ name: 'Login' })
            } else {
              this.error = data.message
            }
          },
    },            

}

export default register_form