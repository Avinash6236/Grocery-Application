export default {
  template: `
  <nav class="navbar navbar-expand-lg bg-success">
  <div class="container-fluid">
  <router-link v-if="role == 'admin'" class="nav-link active" aria-current="page" to="/inbox">Inbox</router-link>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link active" aria-current="page" to="/">Home</router-link>
        </li>
        <li class="nav-item" v-if="role=='admin'">
          <router-link class="nav-link" to="/activate_managers">Manager Approval</router-link>
        </li>
        <li class="nav-item" v-if="role=='manager'">
          <router-link class="nav-link" to="/see_report">See Report</router-link>
        </li>
        <li class="nav-item" v-if="is_login">
          <button class="nav-link" @click='logout' >logout</button>
        </li>
        <li class="nav-item" v-if="! is_login">
          <router-link class="nav-link active" aria-current="page" to="/register">Register</router-link>
        </li>
      </ul>
    </div>
  </div>
</nav>`,
  data() {
    return {
      role: localStorage.getItem('role'),
      cred_:{
        email: localStorage.getItem('email')
      },
      is_login: localStorage.getItem('auth-token'),
      key:0,
      error:'',
      message:''
    }
  },
  methods: {
    async logout() {
      const res = await fetch('http://127.0.0.1:5000/logout_', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.cred_),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.removeItem('auth-token')
        localStorage.removeItem('role')
        this.$router.push({ path: '/login' })
      } else {
        this.error = data.message
      }
      
    },
  },
}
