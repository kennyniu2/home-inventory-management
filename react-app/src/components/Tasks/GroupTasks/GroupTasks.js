import { useState, useEffect } from "react";
import SectionDescription from "../../SectionDescription/SectionDescription"
import Modal from '../../Modal/Modal';
import ErrorMessage from '../../ErrorMessage/ErrorMessage';

function GroupTasks() {
    const [option, setOption] = useState('');
    const [groupedTasks, setGroupedTasks] = useState([]);
    const [isShowTasks, setIsShowTasks] = useState(false);
    const [errMsg, setErrMsg] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [success, setSuccess] = useState(false);
    const [header, setHeader] = useState('');

    const headerDict = {
        "taskname": "Task Name",
        "dateadded": "Date Added",
        "location": "Location",
        "personid#": "Person ID"
    };

    function handleSubmit(event) {
        event.preventDefault();
        
        setIsShowTasks(true)
        setHeader(headerDict[option])
        setGroupedTasks([])

        const postRequest = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            string: option
        })
        }
    
        fetch('/groupBy', postRequest)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setGroupedTasks(data.data)
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
        <div className="container">
            <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
                <ErrorMessage errorMessage={errMsg} />
            </Modal>
            <SectionDescription title="Group Tasks by Specific Information" description="Use the dropdown menu to select how you want to group your tasks!"/>
            {isShowTasks &&
            <div className="centerTableView">
                <table>
                    <tr>
                        <th>{header}</th>
                        <th>Number of Tasks</th>
                    </tr>
                    {groupedTasks.map((val, key) => {
                        let parseDate = ''
                        if (header === "Date Added") {
                            let date = new Date(val[0])
                            let dateFormat = date.toDateString()
                            let timeFormat =  date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0')
                            parseDate = dateFormat + ' at ' + timeFormat
                        }
                        return (
                            <tr key={key}>
                                <td>{header === "Date Added" ?  parseDate : val[0]}</td>
                                <td>{val[1]}</td>
                            </tr>
                        )
                    })}
                </table>
                <br/>
                <button onClick={() => {
                  setGroupedTasks([]);
                  setIsShowTasks(false);
                  setHeader('')
                }}>Clear Results</button>
                {success &&
                    <div className="successMessage">
                        Success!
                    </div>
                }
            </div>
          }
            <form id="groupForm" onSubmit={handleSubmit}>
                <label for="groupby">Choose a characteristic to group by:</label>
                <select onChange={(e) => setOption(e.target.value)} name="group by" id="groupby" required>
                    <option value="" disabled selected>- Select -</option>
                    <option value="taskname">Task Name</option>
                    <option value="dateadded">Date</option>
                    <option value="location">Location</option>
                    <option value="personid#">ID</option>
                </select>
                <br/>
                <button type="submit" value="Submit">Submit</button>
            </form>
        </div>
    )
}

export default GroupTasks;