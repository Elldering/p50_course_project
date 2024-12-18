import CRUD from "../Component/CRUD/CRUD.jsx";


export default function ActionLog() {


  return (
      <div>
         <CRUD modelName="ActionLog" endpoint="http://127.0.0.1:8000/action_logs/" />
      </div>

  )
}