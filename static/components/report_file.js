const report_file  ={
    template:`<div>
                  <h1>Report can be found here by clicking the below link</h1>
                  <button class='btn btn-success' @click="download_report">Download Report</button><span v-if='isWaiting'>Waiting....</span>
             </div>`,
    data() {
        return {
            data:{},
            isWaiting:false,
        }
    },      
    methods: {
        async download_report(){
            this.isWaiting = true
            const res = await fetch('/download-csv')
            const data = await res.json()
            if (res.ok){
                const task_id = data['task-id']
                const intv = setInterval(async () => {
                    const csv_res = await fetch(`/get-csv/${task_id}`)
                    if (csv_res.ok) {
                      this.isWaiting = false
                      clearInterval(intv)
                      window.location.href = `/get-csv/${task_id}`
                    }
                  }, 1000)
            }
        }
    },    
}

export default report_file