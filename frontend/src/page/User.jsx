import CRUD from "../Component/CRUD/CRUD.jsx";


export default function User() {


  return (
      <div>
         <CRUD modelName="user" endpoint="http://127.0.0.1:8000/users/" />

          <div className="card-actions">

        </div>
      </div>

  )
}



