import { useEffect, useState } from "react";
import SectionDescription from "../../SectionDescription/SectionDescription";
import Modal from "../../Modal/Modal";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";

function UpdateAccount() {
    const [accID, setAccID] = useState('');
    const [col, setCol] = useState(null);
    const [newVal, setNewVal] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [errMsg, setErrMsg] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [success, setSuccess] = useState(false);
    const [getAccountSuccess, setGetAccountSuccess] = useState(false);
    const [colError, setColError] = useState(null);
    const [viewAccounts, setViewAccounts] = useState(false);

    function getAccounts() {
        const getRequest = {
          method: 'GET'
        }
    
        fetch('/accounts', getRequest)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setAccounts(data.data)
            setErrMsg(null)
            setGetAccountSuccess(true)
            setTimeout(() => {  setGetAccountSuccess(false) }, 3000)
        } else {
            if (data.errorMsg === errMsg) {
                setOpenModal(true)
            } else {
                setErrMsg(data.errorMsg)
            }
        }})
    }
    function onClickAccounts() {
      if (!viewAccounts) {
              getAccounts();
          }
          setViewAccounts(!viewAccounts)
      }

    function handleSubmit(event) {
        event.preventDefault();

        if (!col) {
          setColError("Please select at least one option.")
          setTimeout(() => {  setColError(null) }, 10000)
          return
        }
    
        const postRequest = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            accountID: accID, 
            updateColumn: col, 
            newValue: newVal
        })
        }
    
        fetch('/update-account-budget', postRequest)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            getAccounts()
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
        <SectionDescription title="Update Account" description="You can edit any part of your account. 
        Use the Dropdown to select what you want to edit, then enter the new value."/>
        <form onSubmit={handleSubmit}>
            <p>Which account would you like to update?</p>
            Account ID: <input onChange={(e) => setAccID(e.target.value)} type="number" id="accountID" placeholder="Enter account ID" required />
            <br/>
            <label for="updateAccount">What would you like to update?</label>
            <select onChange={(e) => setCol(e.target.value)} name="updateAccount" id="updateAccount" required>
              <option disabled selected>- Select -</option>
                <option value="ownerID#">Account Owner ID</option>
                <option value="budget">Budget</option>
                <option value="totalExpenses">Total Expenses</option>
            </select>
            {colError && 
              <div className='inputErrorMessage'>{colError}</div>
            }
            <br/>
            Updated Value: <input onChange={(e) => setNewVal(e.target.value)} type="number" id="newAccountValue" placeholder="Enter new value" step=".01" required/>
            <button type="submit">Save Changes</button>
        </form>
        {success &&
          <div className="successMessage">
              Success!
          </div>
        }
        <br /><br />
        <div className='subNav'>
            <button className='titleButton title' onClick={onClickAccounts}>View Accounts</button>
        </div>
        {viewAccounts &&
        <table>
            <tr>
                <th>Account ID</th>
                <th>Owner ID</th>
                <th>Budget</th>
                <th>Total Expenses</th>
            </tr>
            {accounts.map((val, key) => {
                return (
                    <tr key={key}>
                        <td>{val[0]}</td>
                        <td>{val[1]}</td>
                        <td>{val[2]}</td>
                        <td>{val[3]}</td>
                    </tr>
                    )
                })}
            </table>
        }
        {getAccountSuccess &&
            <div className="successMessage">
                Success!
            </div>
        }
      </div>
    );
  }
  
  export default UpdateAccount;
  