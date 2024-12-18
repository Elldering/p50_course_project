import CRUD from "../Component/CRUD/CRUD.jsx";

export default function Profile() {


  return (
      <div>
         <CRUD modelName="profile" endpoint="http://127.0.0.1:8000/profiles/" />

      </div>

  )
}