import './ProjectItems.css'
import SectionDescription from "../../SectionDescription/SectionDescription";
import { useEffect, useState } from 'react';
import Modal from '../../Modal/Modal';
import ErrorMessage from '../../ErrorMessage/ErrorMessage';

function ProjectItems() {
    const [projectionList, setProjectionList] = useState({
        itemName: false,
        itemDateAcquired: false,
        itemPrice: false,
        itemQuantity: false,
        itemExpiryDate: false,
        itemStorageType: false
    });
    const [itemQuality, setItemQuality] = useState(null);
    const [items, setItems] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [errMsg, setErrMsg] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [success, setSuccess] = useState(false);
    const [qualityErrorMessage, setQualityErrorMessage] = useState(null);
    const [projectionErrorMessage, setProjectionErrorMessage] = useState(null);
    const [fetchItems, setFetchItems] = useState({
        itemQuality: null,
        projectionAttributes: null
    })

    const attributeDict = {
        "itemName": "i.name",
        "itemDateAcquired": "i.dateAcquired",
        "itemPrice": "i.price",
        "itemQuantity": "i.quantity",
        "itemExpiryDate": "i.expiryDate",
        "itemStorageType": "i.storageType"
    };

    const headerDict = {
        "itemName": "Item Name",
        "itemDateAcquired": "Date of Purchase",
        "itemPrice": "Price",
        "itemQuantity": "Quantity",
        "itemExpiryDate": "Expiry Date",
        "itemStorageType": "Storage Type"
    };

    function handleChecked(e) {
        const { name, checked } = e.target;
        setProjectionList({...projectionList, [name]: checked});
    }

    function getProjections() {
        const projections = []
        const headerList = []
        for (const [key, value] of Object.entries(projectionList)) {
            if (value) {
                projections.push(attributeDict[key])
                headerList.push(headerDict[key])
            }
        }

        if (projections.length === 0) {
            setProjectionErrorMessage("Please select at least one option.")
            setTimeout(() => {  setProjectionErrorMessage(null) }, 10000)
            return
        }

        let projectionString = projections.join(', ')

        setFetchItems({itemQuality: itemQuality, projectionAttributes: projectionString})
        setHeaders(headerList)
    }

    useEffect(() => {
        setItems([]);
        if (fetchItems.projectionAttributes) {
            const getRequest = {
                method: 'GET'
              }
            fetch(`/select-poor-items?projection=${fetchItems.projectionAttributes}&qualityAttribute=${fetchItems.itemQuality}`, getRequest)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setItems(data.count)
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
    }, [fetchItems])

    function handleSubmit(event) {
        event.preventDefault();
        if (!itemQuality) {
            setQualityErrorMessage("Please select an option.")
            setTimeout(() => {  setQualityErrorMessage(null) }, 10000)
        } else {
            getProjections();
        }
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
            <SectionDescription title="Select Certain Items" description="Here, you can search for items that have a specific quality. Then, you can select what information you want to see!"/>
            <table>
                <tr>
                {headers.map((val, key) => {
                    return (
                            <th key={key}>{val}</th>
                        )
                    })
                }
                </tr>
                    {items.map((item, key) => {
                        return (
                            <tr>
                            {item.map((row, key) => {
                                return(
                                    <td key={key}>{(headers && (headers[key] === "Date of Purchase" || headers[key] === "Expiry Date")) ? new Date(row).toDateString() : row}</td>
                                )
                            })}
                            </tr>
                        )
                    })}
              </table>
              {success &&
                <div className="successMessage">
                    Success!
                </div>
                }
            <br/>
            <form id="findQualityItems" onSubmit={(e) => {handleSubmit(e)}}>
                <div className='checkBoxInput'>
                    <label htmlFor="insertQuality">Find items with the following quality: </label>
                    <select onChange={(e) => {setItemQuality(e.target.value)}} name="insertQuality" id="insertQuality" required>
                        <option disabled selected>- Select -</option>
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Spoiled">Spoiled</option>
                    </select><br/>
                    {qualityErrorMessage && 
                        <div className='inputErrorMessage'>{qualityErrorMessage}</div>
                    }
                </div>
                <p>What would you like to view?</p>
                <div className='checkBoxInput'>
                    <input type="checkbox" id="itemName" name="itemName" value="i.name" checked={projectionList.itemName} onChange={(e) => handleChecked(e)}/>
                    <label htmlFor="itemName"> Item Name</label><br/>
                </div>
                <div className='checkBoxInput'>
                    <input type="checkbox" id="itemDateAcquired" name="itemDateAcquired" value="i.dateAcquired" checked={projectionList.itemDateAcquired} onChange={(e) => handleChecked(e)}/>
                    <label htmlFor="itemDateAcquired"> Date of Purchase</label><br/>
                </div>
                <div className='checkBoxInput'>
                    <input type="checkbox" id="itemPrice" name="itemPrice" value="i.price" checked={projectionList.itemPrice} onChange={(e) => handleChecked(e)}/>
                    <label htmlFor="itemPrice"> Price</label><br/>
                </div>
                <div className='checkBoxInput'>
                    <input type="checkbox" id="itemQuantity" name="itemQuantity" value="i.quantity" checked={projectionList.itemQuantity} onChange={(e) => handleChecked(e)}/>
                    <label htmlFor="itemQuantity"> Quantity</label><br/>
                </div>
                <div className='checkBoxInput'>
                    <input type="checkbox" id="itemExpiryDate" name="itemExpiryDate" value="i.expiryDate" checked={projectionList.itemExpiryDate} onChange={(e) => handleChecked(e)}/>
                    <label htmlFor="itemExpiryDate"> Expiry Date</label><br/>
                </div>
                <div className='checkBoxInput'>
                    <input type="checkbox" id="itemStorageType" name="itemStorageType" value="i.storageType" checked={projectionList.itemStorageType} onChange={(e) => handleChecked(e)}/>
                    <label htmlFor="itemStorageType"> Item Storage</label><br/>
                </div>
                {projectionErrorMessage && 
                    <div className='inputErrorMessage'>{projectionErrorMessage}</div>
                }
                <br/>
                <button type="submit"> Find items </button>
            </form>
        </div>
    )
}

export default ProjectItems;