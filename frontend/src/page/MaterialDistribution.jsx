import CRUD from "../Component/CRUD/CRUD.jsx";


export default function MaterialDistribution() {


  return (
      <div>
         <CRUD modelName="materialdistribution" endpoint="http://127.0.0.1:8000/material_distributions/" />

      </div>

  )
}