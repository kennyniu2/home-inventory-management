import { useState, useEffect } from "react";
import SectionDescription from "../SectionDescription/SectionDescription";
import Modal from "../Modal/Modal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

function Complaints() {
  const [badRoommates, setBadRoommates] = useState([]);
  const [isShowRoommates, setIsShowRoommates] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [success, setSuccess] = useState(false);

  function getBadRoommates() {
    const getRequest = {
      method: 'GET'
    }
    fetch('/select-count-complaint', getRequest)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setBadRoommates(data.count)
        setErrMsg(null)
        setSuccess(true)
        setTimeout(() => {  setSuccess(false) }, 3000)
    } else {
        if (data.errorMsg == errMsg) {
            setOpenModal(true)
        } else {
            setErrMsg(data.errorMsg)
        }
    }})
  }

  function showRoommates() {
    if (!isShowRoommates) {
      getBadRoommates();
    }
    setIsShowRoommates(!isShowRoommates);
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
        <SectionDescription title="Who needs an intervention?" description="This section showcases roomates who have more than five complaints about them! 
        This might be an indication that an open discussion must take place!"/>
        {isShowRoommates &&
        <table>
          <tr>
              <th>Roommate ID</th>
              <th>Roommate Name</th>
              <th>Number of Complaints about Them</th>
          </tr>
          {badRoommates.map((val, key) => {
              return (
                  <tr key={key}>
                      <td>{val[0]}</td>
                      <td>{val[1]}</td>
                      <td>{val[2]}</td>
                  </tr>
                )
            })}
        </table>
        }
        <br/>
        {success &&
        <div className="successMessage">
            Success!
        </div>
        }
        <button onClick={showRoommates}>Show me the bad roommates!</button>
      </div>
    );
  }
  
  export default Complaints;
  