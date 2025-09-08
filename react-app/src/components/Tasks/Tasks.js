import './Tasks.css'
import { useState, useEffect } from "react";
import InsertTask from './InsertTask/InsertTask';
import SelectTasks from './SelectTasks/SelectTasks';
import GroupTasks from './GroupTasks/GroupTasks';
import AvailablePeople from './AvailablePeople/AvailablePeople';
import Modal from '../Modal/Modal';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

function Tasks() {
    const [allTasks, setAllTasks] = useState([]);
    const [showTasks, setShowTasks] = useState(false);
    const [errMsg, setErrMsg] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [success, setSuccess] = useState(false);

    function getAllTasks() {
        const getRequest = {
          method: 'GET'
        }
        fetch('/demotable', getRequest)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setAllTasks(data.data)
                setErrMsg(null)
                setSuccess(true)
                setTimeout(() => {  setSuccess(false) }, 3000)
            } else {
                if (data.errorMsg === errMsg) {
                    setOpenModal(true)
                } else {
                    setErrMsg(data.errorMsg)
                }
            }})
    }

    function onClick() {
        if (!showTasks) {
            getAllTasks();
        }
        setShowTasks(!showTasks)
    }

    useEffect(() => {
    if (errMsg) {
        setOpenModal(true)
    } else {
        setOpenModal(false)
    }
    }, [errMsg])

    return (
        <div className="subsection">
            <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
                <ErrorMessage errorMessage={errMsg} />
            </Modal>
            <button className="titleButton title" onClick={onClick}>Show All Tasks</button>
            {showTasks &&
            <table>
                <tr>
                    <th>Task Name</th>
                    <th>Date Added</th>
                    <th>Location</th>
                    <th>Roommate ID</th>
                </tr>
                {allTasks.map((val, key) => {
                    let parseDate = ''
                    let date = new Date(val[1])
                    let dateFormat = date.toDateString()
                    let timeFormat =  date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0')
                    parseDate = dateFormat + ' at ' + timeFormat

                    return (
                        <tr key={key}>
                            <td>{val[0]}</td>
                            <td>{parseDate}</td>
                            <td>{val[2]}</td>
                            <td>{val[3]}</td>
                        </tr>
                      )
                  })}
              </table>
          }
          {success &&
            <div className="successMessage">
                Success!
            </div>
            }
          <br/>
          <div className='columnContainer'>
            <InsertTask getAllTasks={getAllTasks}/>
            <AvailablePeople />
          </div>
          <SelectTasks />
          <GroupTasks />
        </div>
    )
}

export default Tasks;