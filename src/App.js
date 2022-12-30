import Header from './components/Header';
import { useState, useEffect } from "react";
import './index.css';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import Footer from './components/Footer';
import About from './components/About';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {

  const [showAddTask, setShowAddTask] = useState( false );

  const [tasks, setTasks] = useState([]);

  useEffect( () => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks();
  }, [])

  // Fetch Task From Fake Database (JSON)
      const fetchTasks = async () => {
      const res = await fetch( 'http://localhost:5000/tasks' );
      const data = await res.json()

      return data;
      }
  
      const fetchTask = async (id) => {
      const res = await fetch( `http://localhost:5000/tasks/${id}` );
      const data = await res.json()

      return data;
    }
  
  // ADD Task
  const addTask = async ( task ) => {
    const res = await fetch( 'http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(task),
    } )
    
    const data = await res.json();
    setTasks( [...tasks, data] );
    // const id = Math.floor( Math.random() * 10000 ) + 1;
    // const newTask = { id, ...task }
    // setTasks([...tasks, newTask])
  }

 //Delete task
  const deleteTask = async ( id ) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {method:'DELETE'})
    setTasks(tasks.filter((task) => task.id !== id))
  }

  //Set reminder
  const reminderSwitch = async ( id ) => {
    const taskToSwitchReminder = await fetchTask( id );
    const updateTask = {
      ...taskToSwitchReminder,
      reminder: !taskToSwitchReminder.reminder
    }

    const res = await fetch( `http://localhost:5000/tasks/${id}`,{
      method: "PUT",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(updateTask)
    } )
    
    const data = await res.json()

    setTasks(
      tasks.map(
        ( task ) => task.id === id
          ?
          {
            ...task, reminder
              :
              data.reminder
          }
          :
          task
      )
    );
  }

  return (
    <Router>
      <div className="container">
        <Header
          onAdd={() => setShowAddTask( !showAddTask )}
          showAdd={showAddTask}
        />
        {
          showAddTask
          &&
          <AddTask onAdd={addTask} />
        }
        {
          tasks.length > 0
            ?
            <Tasks tasts={tasks}
              Tasks tasks={tasks}
              onDelete={deleteTask}
              onToggle={reminderSwitch}
            />
            :
            ( "This list is empty..." )
        }
        <Route path='/' exact render={
          (props) => (
            <>
              {
                showAddTask && <AddTask onAdd={addTask} />
              }
            </>
          )
        } />
        <Route path='/about' component={About} ></Route>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
