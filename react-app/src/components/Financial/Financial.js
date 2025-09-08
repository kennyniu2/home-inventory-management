import '../../index.css'
import './Financial.css'
import { useState } from 'react';
import UpdateAccount from './UpdateAccount/UpdateAccount';
import UpdateBillProvider from './UpdateBillProvider/UpdateBillProvider';
import TransactionsPerPerson from './TransactionsPerPerson/TransactionPerPerson';

function Financial() {
  const [tab, setTab] = useState('');

    return (
      <div className="subsection">
        <div className='subNav'>
          <button className='titleButton title' onClick={() => setTab('Bill')}>Update Bill Provider</button>
          <button className='titleButton title' onClick={() => setTab('Account')}>Update Account Details</button>
          <button className='titleButton title' onClick={() => setTab('Transactions')}>Transactions</button>
        </div>
        {tab === 'Bill' &&
          <UpdateBillProvider />
        }
        {tab === 'Account' &&
          <UpdateAccount />
        }
        {tab === 'Transactions' &&
          <TransactionsPerPerson />
        }
      </div>
    );
  }
  
  export default Financial;
  