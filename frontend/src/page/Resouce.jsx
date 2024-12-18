import CRUD from "../Component/CRUD/CRUD.jsx";


export default function Resouce() {


  return (
      <div>
         <CRUD modelName="resource" endpoint="http://127.0.0.1:8000/resources/" />

      </div>

  )
}