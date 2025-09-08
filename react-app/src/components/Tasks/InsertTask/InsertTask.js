import { useState , useEffect} from 'react';
import SectionDescription from '../../SectionDescription/SectionDescription'
import Modal from '../../Modal/Modal';
import ErrorMessage from '../../ErrorMessage/ErrorMessage';
import { inputIsValid } from '../../../utils/ValidationFunction'

function InsertTask({getAllTasks}) {
    const [taskInfo, setTaskInfo] = useState({
        taskname: '',
        location: '',
        personid: ''
    })
    const [errMsg, setErrMsg] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [success, setSuccess] = useState(false);
    const [taskNameError, setTaskNameError] = useState(null);
    const [locationError, setLocationError] = useState(null);

    function handleSubmit(event) {
        event.preventDefault();

        if (!inputIsValid(taskInfo.taskname)) {
            setTaskNameError("Please remove any special characters and any SQL commands (e.g. SELECT, WHERE, FROM).")
            setTimeout(() => {  setTaskNameError(null) }, 10000)
            return
        }
        if (!inputIsValid(taskInfo.location)) {
            setLocationError("Please remove any special characters and any SQL commands (e.g. SELECT, WHERE, FROM).")
            setTimeout(() => {  setLocationError(null) }, 10000)
            return
        }
    
        const postRequest = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            taskname: taskInfo.taskname,
            dateadded: (new Date()).toISOString(),
            location: taskInfo.location,
            personid: taskInfo.personid
        })
        }
    
        fetch('/insert-demotable', postRequest)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                getAllTasks()
                setErrMsg(null)
                setSuccess(true)
                setTimeout(() => {  setSuccess(false) }, 3000)
            } else {
                if (data.errorMsg === errMsg) {
                    setOpenModal(true)
                } else {
                    setErrMsg(data.errorMsg)
                }
            }
        })
    }

    useEffect(() => {
    if (errMsg) {
        setOpenModal(true)
    } else {
        setOpenModal(false)
    }
    }, [errMsg])

    return (
        <div className='container'>
            <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
                <ErrorMessage errorMessage={errMsg} />
            </Modal>
            <SectionDescription title="Add New Task" description="Have a new task for someone to do? Add it here! Enter the necessary task details so that someone can complete it!"/>
            <form id="insertTasks" onSubmit={handleSubmit}>
                Task Name: <input 
                type="text" 
                id="insertTaskName" 
                placeholder="Enter Task Name" 
                value={taskInfo.taskname} 
                onChange={(e) => setTaskInfo({...taskInfo, taskname: e.target.value})} required/> 
                {taskNameError && 
                    <div className='inputErrorMessage'>{taskNameError}</div>
                }
                <br/>
                Task Location: <input 
                type="text" 
                id="insertLocation" 
                placeholder="Enter Location"
                value={taskInfo.location} 
                onChange={(e) => setTaskInfo({...taskInfo, location: e.target.value})}
                required/> 
                {locationError && 
                    <div className='inputErrorMessage'>{locationError}</div>
                }
                <br/>
                Assigned task to this person: <input 
                type="number" 
                id="insertTaskID" 
                placeholder="Enter Person ID"
                value={taskInfo.personid} 
                onChange={(e) => setTaskInfo({...taskInfo, personid: e.target.value})}
                required/> <br/>
                <button type="submit"> Add Task </button> <br/>
            </form>
            {success &&
            <div className="successMessage">
                Success!
            </div>
            }
        </div>
    )
}

export default InsertTask;