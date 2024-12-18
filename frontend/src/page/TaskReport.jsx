import CRUD from "../Component/CRUD/CRUD.jsx";


export default function TaskReport() {


  return (
      <div>
         <CRUD modelName="taskreport" endpoint="http://127.0.0.1:8000/task_reports/" />

      </div>

  )
}