import './App.css';
import { useState } from 'react';
import Items from './components/Items/Items'
import Financial from './components/Financial/Financial'
import Complaints from './components/Complaints/Complaints';
import Tasks from './components/Tasks/Tasks';
import People from './components/People/People';
import Welcome from './components/Welcome/Welcome';

function App() {
  const [tab, setTab] = useState('');

  
  return (
    <div className="App">
      <header className="App-header">
        Home Management
      </header>
      <div className="nav-bar">
        <div className="tab" onClick={() => setTab('People')}>
          Household Members
        </div>
        <div className="tab" onClick={() => setTab('Tasks')}>
          Tasks
        </div>
        <div className="tab" onClick={() => setTab('Items')}>
          Items
        </div>
        <div className="tab" onClick={() => setTab('Financial')}>
          Financial
        </div>
        <div className="tab" onClick={() => setTab('Complaints')}>
          Complaints
        </div>
      </div>
      <div>
        {tab === 'Items' &&
          <Items />
        }
        {tab === 'Financial' &&
          <Financial />
        }
        {tab === 'Complaints' &&
          <Complaints />
        }
        {tab === 'Tasks' &&
          <Tasks />
        }
        {tab === 'People' &&
          <People />
        }
        {tab === '' &&
          <Welcome />
        }
      </div>
    </div>
  );
}

export default App;
