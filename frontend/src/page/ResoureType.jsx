import CRUD from "../Component/CRUD/CRUD.jsx";


export default function ResoureType() {


  return (
      <div>
         <CRUD modelName="resourcetype" endpoint="http://127.0.0.1:8000/resource_types/" />

      </div>

  )
}