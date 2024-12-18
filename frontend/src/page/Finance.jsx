import CRUD from "../Component/CRUD/CRUD.jsx";


export default function Finance() {


  return (
      <div>
         <CRUD modelName="finance" endpoint="http://127.0.0.1:8000/finances/" />

      </div>

  )
}