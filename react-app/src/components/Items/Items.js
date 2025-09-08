import "./Items.css"
import { useEffect, useState } from "react";
import ProjectItems from "./ProjectItems/ProjectItems";
import Modal from "../Modal/Modal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

function Items() {
  const [showItems, setShowItems] = useState(false);
  const [allItems, setAllItems] = useState([]);
  const [onlyShowPopular, setOnlyShowPopular] = useState(false);
  const [popularItems, setPopularItems] = useState([]);
  const [errMsg, setErrMsg] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [success, setSuccess] = useState(false);

  function getItems() {
    const getRequest = {
      method: 'GET'
    }
    fetch('/items', getRequest)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setAllItems(data.data)
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

  function getPopularItems() {
    const getRequest = {
      method: 'GET'
    }
    fetch('/select-items-consumed-by-all', getRequest)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setPopularItems(data.table)
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

  function showPopularItemsOnly() {
    setOnlyShowPopular(!onlyShowPopular);
    getPopularItems();
  }

  function onClickItems() {
    if (!showItems) {
      getItems();
    }
    setShowItems(!showItems)
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
        <button className="titleButton title" onClick={onClickItems}>Show All Items</button>
        {showItems &&
        <div className="itemSection">
          {!onlyShowPopular &&
            <table>
                <tr>
                    <th>Name</th>
                    <th>Date of Purchase</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Expiry Date</th>
                    <th>Storage Type</th>
                </tr>
                {allItems.map((val, key) => {
                    return (
                        <tr key={key}>
                            <td>{val[0]}</td>
                            <td>{new Date(val[1]).toDateString()}</td>
                            <td>{val[2]}</td>
                            <td>{val[3]}</td>
                            <td>{val[4] ? new Date(val[4]).toDateString() : val[4]}</td>
                            <td>{val[5]}</td>
                        </tr>
                      )
                  })}
              </table>
          }
          {onlyShowPopular &&
            <table>
                <tr>
                    <th>Name</th>
                    <th>Date of Purchase</th>
                </tr>
                {popularItems.map((val, key) => {
                    return (
                        <tr key={key}>
                            <td>{val[0]}</td>
                            <td>{new Date(val[1]).toDateString()}</td>
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
          <button className="titleButton" onClick={showPopularItemsOnly}>Show Popular Items</button>
          <br/>
          </div>
        }
        <ProjectItems />
      </div>
    );
  }
  
  export default Items;
  