import CRUD from "../Component/CRUD/CRUD.jsx";


export default function Project() {


  return (
      <div>
         <CRUD modelName="project" endpoint="http://127.0.0.1:8000/projects/" />

      </div>

  )
}