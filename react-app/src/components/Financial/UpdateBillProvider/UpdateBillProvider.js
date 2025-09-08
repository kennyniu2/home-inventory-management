import { useEffect, useState } from 'react';
import Modal from '../../Modal/Modal'
import ErrorMessage from '../../ErrorMessage/ErrorMessage';
import SectionDescription from '../../SectionDescription/SectionDescription';
import { inputIsValid } from '../../../utils/ValidationFunction'

function UpdateBillProvider() {
    const [billInput, setBillInput] = useState({
        billName: '',
        newServiceProvider: ''
    });
    const [utilityBillProvider, setUtilityBillProvider] = useState([]);
    const [errMsg, setErrMsg] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [success, setSuccess] = useState(false);
    const [getBillSuccess, setGetBillSuccess] = useState(false);
    const [providerError, setProviderError] = useState(null);
    const [billNameError, setBillNameError] = useState(null);
    const [viewBillProvider, setViewBillProvider] = useState(false);
    
    function getBills() {
        const getRequest = {
            method: 'GET'
        }

        fetch('/utilityBillProvider', getRequest)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
            setUtilityBillProvider(data.data)
            setErrMsg(null)
            setGetBillSuccess(true)
            setTimeout(() => {  setGetBillSuccess(false) }, 3000)
        } else {
            if (data.errorMsg === errMsg) {
                setOpenModal(true)
            } else {
                setErrMsg(data.errorMsg)
            }
        }})
    }

    function onClickBills() {
    if (!viewBillProvider) {
            getBills();
        }
        setViewBillProvider(!viewBillProvider)
    }
    
    useEffect(() => {
    if (errMsg) {
        setOpenModal(true)
    } else {
        setOpenModal(false)
    }
    }, [errMsg])
    
    function handleSubmit(event) {
        event.preventDefault();

        if (!inputIsValid(billInput.billName)) {
            setBillNameError("Please remove any special characters and any SQL commands (e.g. SELECT, WHERE, FROM).")
            setTimeout(() => {  setBillNameError(null) }, 10000)
            return
        }
        if (!inputIsValid(billInput.newServiceProvider)) {
            setProviderError("Please remove any special characters and any SQL commands (e.g. SELECT, WHERE, FROM).")
            setTimeout(() => {  setProviderError(null) }, 10000)
            return
        }

        const postRequest = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            newServiceProvider: billInput.newServiceProvider,
            billName: billInput.billName
        })
        }

        fetch('/update-utility-bill-provider', postRequest)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
            getBills()
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
    return (
        <div className="container">
            <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
                <ErrorMessage errorMessage={errMsg} />
            </Modal>
        <div className='container'>
        <SectionDescription 
        title="Update Utility Bill Provider" 
        description="This section allows you to change your service provider for a specific bill. 
        Enter the the name of the bill you want to change, then enter your new service provider."/>
        <form className='utility-bill-form' onSubmit={handleSubmit}>
        Bill Name: <input 
            type='text' 
            placeholder="Enter your bill name" 
            value={billInput.billName} 
            onChange={(e) => setBillInput({...billInput, billName: e.target.value})} required/>
        {billNameError && 
            <div className='inputErrorMessage'>{billNameError}</div>
        }
        New Service Provider:
        <input 
            type='text' 
            placeholder='Enter your new service provider'
            value={billInput.newServiceProvider} 
            onChange={(e) => setBillInput({...billInput, newServiceProvider: e.target.value})} required/>
        {providerError && 
            <div className='inputErrorMessage'>{providerError}</div>
        }
        <button type='submit'>Save Changes</button>
        </form>
    </div>
    {success &&
        <div className="successMessage">
            Success!
        </div>
    }
    <br /><br />
    <div className='subNav'>
        <button className='titleButton title' onClick={onClickBills}>View Bill Providers</button>
    </div>
    {viewBillProvider &&
    <table>
        <tr>
            <th>Bill Name</th>
            <th>Service Provider</th>
        </tr>
        {utilityBillProvider.map((val, key) => {
            return (
                <tr key={key}>
                    <td>{val[0]}</td>
                    <td>{val[1]}</td>
                </tr>
                )
            })}
        </table>
    }
    {getBillSuccess &&
        <div className="successMessage">
            Success!
        </div>
    }
    </div>
    )
}

export default UpdateBillProvider;