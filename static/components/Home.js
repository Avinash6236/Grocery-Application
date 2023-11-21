import StudentHome from './StudentHome.js'
import InstructorHome from './InstructorHome.js'
import AdminHome from './AdminHome.js'
import HomeElse from './HomeElse.js'

export default {
  template: `<div>
  <StudentHome v-if="userRole=='stud'" :userEmail="userEmail"/>
  <AdminHome v-if="userRole=='admin'" />
  <InstructorHome v-if="userRole=='inst'" />
  </div>`,

  data() {
    return {
      userRole: localStorage.getItem('role'),
      userEmail: localStorage.getItem('email')
    }
  },

  components: {
    StudentHome,
    InstructorHome,
    AdminHome,
    HomeElse,
  },
}
