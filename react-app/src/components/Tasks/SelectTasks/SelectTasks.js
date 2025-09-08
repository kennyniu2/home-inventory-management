import { useState, useEffect } from "react";
import SectionDescription from "../../SectionDescription/SectionDescription";
import Modal from '../../Modal/Modal';
import ErrorMessage from '../../ErrorMessage/ErrorMessage';
import { inputIsValidForSelection } from '../../../utils/ValidationFunction';

function SelectTasks() {
    const [selection, setSelection] = useState('');
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [isShowTasks, setIsShowTasks] = useState(false);
    const [errMsg, setErrMsg] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [success, setSuccess] = useState(false);
    const [selectionError, setSelectionError] = useState(null);

    function handleSubmit(event) {
        event.preventDefault();
        
        if (!inputIsValidForSelection(selection)) {
            setSelectionError("Please remove any SQL commands not suited in the WHERE clause (e.g. ADD, DELETE).")
            setTimeout(() => {  setSelectionError(null) }, 10000)
            return
        }

        setIsShowTasks(true);
        setSelectedTasks([]);
    
        const postRequest = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            string: selection
        })
        }
    
        fetch('/selectTable', postRequest)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setSelectedTasks(data.data)
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
        <div className="container" onSubmit={handleSubmit}>
            <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
                <ErrorMessage errorMessage={errMsg} />
            </Modal>
            <SectionDescription title="Select Specific Tasks" description={
                <p>
                    You can search for specific tasks.
                    How to format your search: [attribute name] &lt;operator&gt; [value]. You can apply multiple search options using AND/OR. 
                    <br/><br/>
                    For example, if I wanted to search for tasks in the Kitchen or tasks assigned to a roommate with ID = 3, <br/> the search input would be: location=Kitchen OR personID#=3.
                    <br/><br/>
                    Some allowed operators: =, &lt;, &gt;
                    <br/>
                    Task attributes to search over: taskName, dateAdded, location, personID#
                    <br/><br/>
                    NOTE: Don't quotation marks!
                </p>
                }/>
            {isShowTasks &&
            <div className="centerTableView">
                <table>
                    <tr>
                        <th>Task Name</th>
                        <th>Date Added</th>
                        <th>Location</th>
                        <th>Roommate ID</th>
                    </tr>
                    {selectedTasks.map((val, key) => {
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
              <br/>
              <button onClick={() => {
                  setSelectedTasks([]);
                  setIsShowTasks(false);
              }}>Clear Search</button>
              {success &&
                <div className="successMessage">
                    Success!
                </div>
                }
            </div>
          }
            <form id="insertSelectTable">
                Select: <input 
                type="text" 
                id="selectID" 
                placeholder="Enter details about the tasks" 
                value={selection} 
                onChange={(e) => setSelection(e.target.value)}
                required/>
                {selectionError && 
                    <div className='inputErrorMessage'>{selectionError}</div>
                }
                <br/>
                <button type="submit"> Select </button> <br/>
            </form>
        </div>
    )
}

export default SelectTasks;