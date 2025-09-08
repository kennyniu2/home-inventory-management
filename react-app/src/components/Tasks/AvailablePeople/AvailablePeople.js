import './AvailablePeople.css'
import { useEffect, useState } from "react";
import Modal from '../../Modal/Modal';
import ErrorMessage from '../../ErrorMessage/ErrorMessage';

function AvailablePeople() {
    const [isShowPeople, setIsShowPeople] = useState(false);
    const [availPeople, setAvailPeople] = useState([]);
    const [errMsg, setErrMsg] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [success, setSuccess] = useState(false);

    function getAvailPeople() {
        const getRequest = {
          method: 'GET'
        }
        fetch('/available-people-table', getRequest)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setAvailPeople(data.data)
                setErrMsg(null)
                setSuccess(true)
                setTimeout(() => {  setSuccess(false) }, 3000)
            } else {
                if (data.errorMsg == errMsg) {
                    setOpenModal(true)
                } else {
                    setErrMsg(data.errorMsg)
                }
            }
        })
    }

    function onClick() {
        if (!isShowPeople) {
            getAvailPeople();
        }
        setIsShowPeople(!isShowPeople)
    }

    useEffect(() => {
        if (errMsg) {
            setOpenModal(true)
        } else {
            setOpenModal(false)
        }
    }, [errMsg])
    
    return (
        <div className="peopleContainer">
            <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
                <ErrorMessage errorMessage={errMsg} />
            </Modal>
            <button onClick={onClick} className="titleButton title">Show Busiest People</button>
            {isShowPeople &&
            <div>
                <div>Welcome to the Hall of Fame for Tasks!</div>
                <br/>
                <div>These are people who are doing more task than the average person in this household! Give them a pat on the back.</div>
                <br />
                <table>
                    <tr>
                        <th>Name</th>
                        <th>Number of Tasks</th>
                    </tr>
                    {availPeople.map((val, key) => {
                        return (
                            <tr key={key}>
                                <td>{val[0]}</td>
                                <td>{val[1]}</td>
                            </tr>
                        )
                    })}
                </table>
            </div>
          }
          {success &&
            <div className="successMessage">
                Success!
            </div>
            }
        </div>
    )
}

export default AvailablePeople;