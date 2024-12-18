import CRUD from "../Component/CRUD/CRUD.jsx";


export default function Role() {


  return (
      <div>
         <CRUD modelName="role" endpoint="http://127.0.0.1:8000/roles/" />

      </div>

  )
}