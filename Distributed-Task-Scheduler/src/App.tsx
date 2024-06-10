import './App.css'
import Task from './component/task'
import { Route, Routes, } from 'react-router-dom'
import TaskList from './component'
import SchedualeTaskList from './component/view_schduale_task'
function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<TaskList />} />
        <Route path='/addTask' element={<Task />} />
        <Route path='/editTask/:id' element={<Task />} />
        <Route path='/viewTask/:id/:task_name' element={<SchedualeTaskList />} />
        <Route path='*' element={<h2>Page Not Found</h2>} />
      </Routes>
    </>
  )
}

export default App
