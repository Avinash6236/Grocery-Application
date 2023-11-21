export default{
    template:`<div>
                <h1>id:{{studentId}}</h1>
                <h1>course id:{{courseId}}</h1>
                <h1>First Name:{{student.firstName}}</h1>
                <h2>Full Name:{{fullname}}</h2>
                <h3>What is relation with you:{{student.relation}}</h3>
            </div>
            
            <h1>Category id: {{category_id}}</h1>
            <div v-if="products.hasOwnProperty('message')">
              <h1>{{ products['message'] }}</h1>
            </div>

            `
}