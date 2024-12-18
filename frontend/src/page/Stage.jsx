import CRUD from "../Component/CRUD/CRUD.jsx";


export default function Stage() {


  return (
      <div>
         <CRUD modelName="stage" endpoint="http://127.0.0.1:8000/stages/" />

      </div>

  )
}