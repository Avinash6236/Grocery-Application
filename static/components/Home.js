import StudentHome from './StudentHome.js'
import InstructorHome from './InstructorHome.js'
import managerHome from './managerHome.js'
import HomeElse from './HomeElse.js'

export default {
  template: `<div>
  <StudentHome v-if="userRole=='user'" :userEmail="userEmail"/>
  <managerHome v-if="userRole=='manager'" />
  <InstructorHome v-if="userRole=='admin'" />
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
    managerHome,
    HomeElse,
  },
}
