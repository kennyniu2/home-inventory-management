import { useEffect, useState } from "react"
import DeleteButton from './DeletePerson/DeleteButton'
import Modal from "../Modal/Modal"
import ErrorMessage from "../ErrorMessage/ErrorMessage"
import formatPhoneNumber from "../../utils/formatPhoneNumber"

function People() {
    const [isShowPeople, setIsShowPeople] = useState(false);
    const [people, setPeople] = useState([]);
    // error message
    const [errMsg, setErrMsg] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [success, setSuccess] = useState(false)

    function getPeople() {
        const getRequest = {
          method: 'GET'
        }
        fetch('/people', getRequest)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setPeople(data.data)
                setErrMsg(null)
                setSuccess(true)
                setTimeout(() => {  setSuccess(false) }, 3000)
            } else {
                setErrMsg(data.errorMsg)
            }
        })
    }

    // if error message updated -> open modal
    useEffect(() => {
        if (errMsg) {
            setOpenModal(true)
        } else {
            setOpenModal(false)
        }
    }, [errMsg])

    function onClick() {
        if (!isShowPeople) {
            getPeople();
        }
        setIsShowPeople(!isShowPeople);
    }

    function onDelete(id) {
        const postRequest = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: id
          })
          }
      
          fetch('/remove-people', postRequest)
          .then(response => response.json())
          .then(data => {
            if (data.success) {
                getPeople()
                setErrMsg(null)
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

    return (
        <div className="subsection">
            <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
                <ErrorMessage errorMessage={errMsg} />
            </Modal>
            <button onClick={onClick} className="titleButton title">Show Household Members</button>
            {isShowPeople &&
            <table>
                <tr>
                    <th>Remove</th>
                    <th>Member ID</th>
                    <th>Name</th>
                    <th>Date of Birth</th>
                    <th>Employer</th>
                    <th>Phone Number</th>
                    <th>Assigned Room</th>
                </tr>
                {people.map((val, key) => {
                    return (
                        <tr key={key}>
                            <td><DeleteButton onClickHandler={onDelete} personId={val[0]} /></td>
                            <td>{val[0]}</td>
                            <td>{val[1]}</td>
                            <td>{new Date(val[2]).toDateString()}</td>
                            <td>{val[3]}</td>
                            <td>{formatPhoneNumber(val[4])}</td>
                            <td>{val[5]}</td>
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
        </div>
    )   
}

export default People;