import { useState, useEffect } from "react"
import SectionDescription from "../../SectionDescription/SectionDescription"
import Modal from "../../Modal/Modal";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";

function TransactionsPerPerson() {
    const [trans, setTrans] = useState([])
    const [id, setId] = useState(null);
    const [errMsg, setErrMsg] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [success, setSuccess] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();

        setTrans([]);

        const getRequest = {
            method: 'GET'
        }
        fetch(`/find-people-transactions?id=${id}`, getRequest)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setTrans(data.data)
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
            <SectionDescription title="Find your Transactions" description="Enter your personal ID# to view your transactions."/>
            <table>
                <tr>
                    <th>Date Added</th>
                    <th>Total Price</th>
                    <th>Description</th>
                </tr>
                {trans.map((val, key) => {
                    return (
                        <tr key={key}>
                            <td>{new Date(val[0]).toDateString()}</td>
                            <td>{val[1]}</td>
                            <td>{val[2]}</td>
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
            <form id="findTransactions" onSubmit={handleSubmit}>
                Personal ID: <input type="number" id="findTransactionsID" placeholder="Enter ID" onChange={(e) => setId(e.target.value)} required/> <br/><br/>

                <button type="submit"> View Transactions </button> <br/>
            </form>
        </div>
    )
}
export default TransactionsPerPerson