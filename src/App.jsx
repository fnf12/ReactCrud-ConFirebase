import React from 'react'
import {firebase} from './firebase'

function App() {

  const [tareas, setTareas] = React.useState([])
  const [tarea, setTarea] = React.useState('')
  const [modoEdicion, setModoEdicion] = React.useState(false)
  const [id, setId] = React.useState('')
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    const obtenerDatos = async () => {

      try {
        
        const db = firebase.firestore();
        const data = await db.collection('tareas').get();
        const arrayData = data.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        setTareas(arrayData);

      } catch (error) {
        console.error(error)
      }
    }

    obtenerDatos();
  }, [])

  const agregar = async (e) => {
    e.preventDefault();

    if(!tarea.trim()){
      setError('Escriba algo por favor...')
      return
    }

    try {
      
      const db = firebase.firestore()
      const nuevaTarea = {
        name: tarea,
        fecha: Date.now()
      }

      const data = await db.collection('tareas').add(nuevaTarea)
      
      setTareas([
        ...tareas,
        {...nuevaTarea, id: data.id}
      ])
      
      setTarea('')
      setError(null)

    } catch (error) {
      console.log(error)
    }

  }
  
  const eliminar = async (id) => {
    try {
      
      const db = firebase.firestore()
      await db.collection('tareas').doc(id).delete()

      const arrayfiltrado = tareas.filter(item => item.id !== id)

      setTareas(arrayfiltrado)

    } catch (error){
      console.log(error)
    }
  }

  const activarEdicion = (item) => {
    setModoEdicion(true)
    setTarea(item.name)
    setId(item.id)
  }

  const editar = async (e) =>{
    e.preventDefault()

    if(!tarea.trim()){
      setError('Escriba algo por favor...')
      return
    }

    try {
      
      const db = firebase.firestore()
      
      await db.collection('tareas').doc(id).update({
        name: tarea
      })

      const arrayfiltrado = tareas.map(item => (
        item.id === id ? {id: item.id, fecha: item.fecha, name: tarea} :
        item
      ))
      
      setTareas(arrayfiltrado)
      
      setModoEdicion(false)
      setTarea('')
      setId('')
      setError(null)

    } catch (error) {
      console.log(error)
    }
  }

  const cancelar = ()=> {
    //console.log(item)
    setModoEdicion(false)
    setTarea('')
    setError(null)
  }

  return (
    <div className="container mt-3">
      <h1 className="text-center">CRUD TAREAS CON FIREBASE</h1>
      <div className="row mt-3">
        <div className="col-lg-6">
            <h4>
              {
                modoEdicion ? 'Editar Tarea' : 'Agregar Tarea'
              }
            </h4>
            <form onSubmit={modoEdicion ? editar : agregar}>

              {
                error ? <span className="text-danger">{error}</span> : null
              }

              <input 
                type="text" 
                placeholder="Ingrese Tarea"
                className="form-control mb-2"
                onChange={e => setTarea(e.target.value)}
                value={tarea}
              />
              <div>
              {
                modoEdicion ? (
                  <div className="d-flex justify-content-around">
                  <button className="btn btn-warning col-5" type="submit">Aceptar</button>
                  <button onClick={() => cancelar()} className="btn btn-dark col-5"> Cancelar</button>
                  </div>
                ) : ( 
                  <button className="btn btn-dark col-12" 
                  type="submit" >Agregar</button>
                )
              }
            </div>
            </form>
        </div>
        <div className="col-lg-6 mt-2 mt-lg-0">
        <h4>Lista de tareas</h4>
          <ul className="list-group">
            {
              tareas.length === 0 ? (
                <li className="list-group-item">No hay items</li>) :
                (
                  tareas.map(item =>(
                    <li className="list-group-item" key={item.id}>
                      <span className="text-break">{item.name}</span>
                      <div className="btn-group float-end" role="group" aria-label="Basic example">
                        <button className="btn btn-danger btn-sm"
                          onClick={() => eliminar(item.id)}
                        >
                          <i class="bi bi-trash" title="eliminar"></i>
                        </button>
                        <button className="btn btn-warning btn-sm me-2"
                          onClick= {() => activarEdicion(item)}
                        >
                          <i class="bi bi-pencil" title="editar"></i>
                        </button>
                      </div>
                    </li>
                  ))
                )
            }
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
