const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');
const fs = require('fs');
const messages = require('./utils/messages');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchPeopleFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM People');
        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function fetchUtilityBillProviderFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM UtilityBillProvider');
        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function fetchUtilityBillFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT name, dueDate, periodStartDate, periodEndDate FROM UtilityBill');
        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function fetchItemsFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Items');
        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function fetchComplaintsFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM FileComplaint');
        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function fetchConsumedItemsFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Consume');
        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function fetchAccountsFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM PossessAccount');
        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function fetchDoTaskFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM DoTask');
        return result.rows;
    }).catch(() => {
        return false;
    });
}

// Insert People from Front-End
async function insertPeople(id, name, dob, employer, phoneNumber, assignedRoom) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO People (ID#, name, DOB, employer, phoneNumber, assignedRoom) VALUES (:id, :name, :dob, :employer, :phoneNumber, :assignedRoom)`,
            [id, name, new Date(dob), employer, phoneNumber, assignedRoom],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// UPDATE QUERY: Update the budget of account
async function updateAccountBudget(accountID, updateColumn, newValue) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE PossessAccount SET ${updateColumn}=:newValue WHERE accountID#=:accountID`,
            [newValue, accountID],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// EXTRA QUERY: Update the ServiceProviderPlant of a certain bill
async function updateUtilityBillServiceProvider(newServiceProvider, billName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE UtilityBillProvider SET serviceProviderPlan=:newServiceProvider WHERE name=:billName`,
            [newServiceProvider, billName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// PROJECTION: Select the item name and expiry date with the condition of given quality status
// Note: using :projection in selection didn't recognize as attributes to project on
//       and would just return the value of projection for every queried item. However, ${projection} works well here
async function getQualityItems(projection, qualityAttribute) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT ${projection} 
            FROM Items i, ItemQuality q 
            WHERE i.expiryDate = q.expiryDate AND q.quality=:qualityAttribute`,
            [qualityAttribute]
        );

        return result.rows
    }).catch(() => {
        return false;
    });
}

// GROUP BY + HAVING QUERY: Select roommates that have more than 5 complaints
async function countComplaintsGreaterThan5() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT f.toPersonID#, p.name, Count(*) 
            FROM FileComplaint f, People p 
            WHERE f.toPersonID#=p.ID# 
            GROUP BY f.toPersonID#, p.name 
            HAVING COUNT(*) > 5 
            ORDER BY COUNT(*) DESC, f.toPersonID# DESC
            `);
        return result.rows;
    }).catch(() => {
        return false;
    });
}

// DIVISION: obtain items that have been consumed by everyone
async function getItemsConsumedByAll() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT i.name, i.dateAcquired
            FROM Items i
            WHERE NOT EXISTS (
            (SELECT p.ID# FROM People p)
            MINUS
            (SELECT c.personID# FROM Consume c WHERE i.name=c.itemName AND i.dateAcquired = c.dateAcquired)
            )
            `);
        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function getAvailablePeopleFromDB() {
    return await withOracleDB(async (connection) => {
        await connection.execute(`CREATE OR REPLACE VIEW everyoneNumTasks AS
        SELECT p.id# AS id#, COUNT(*) AS numTasks
        FROM People p, DoTask dt
        WHERE p.id#=dt.personid#
        GROUP BY p.id#`);

        const result = await connection.execute(`SELECT p.name, e.numTasks
        FROM everyoneNumTasks e, People p
        WHERE p.id#=e.id# AND e.numTasks > (SELECT AVG(numTasks) FROM everyoneNumTasks e2)
        ORDER BY e.numTasks DESC`
        );
        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function removePerson(id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE
             FROM People p
             WHERE p.id# = :id`,
            [id],
            {autoCommit: true}
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        console.log('Person could not be removed.');
        return false;
    });
}

// in progress
async function listTransactionsFromID(id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT ep.dateAdded, ep.totalPrice, ep.description
             FROM PossessAccount pe,
                  Track t,
                  Expense e,
                  ExpensePrice ep
             WHERE pe.accountID# = t.accountID#
               AND t.transactionID# = e.transactionID#
               AND e.description = ep.description
               AND e.dateAdded = ep.dateAdded
               AND pe.ownerID# = :id
             ORDER BY ep.dateAdded DESC`,
            [id]
        );

        if(result.rows.length == 0) {
            return false;
        } else {
            return result.rows;
        }
    }).catch(() => {
        return false;
    });
}

async function insertDemotable(taskname, dateadded, location, personid) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DOTASK (taskname, dateadded, location, personid#) VALUES (:taskname, :dateadded, :location, :personid)`,
            [taskname, new Date(dateadded), location, personid],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

function parseSelection(string){
    const knownColumns = ['TASKNAME', 'DATEADDED', 'LOCATION', 'PERSONID#'];
    const knownOperators = ['=', '>', "<", "<=", ">=", "!="];
    const andAndOr = ['AND', 'OR'];

    const splitString = string.split(/(AND|OR|=|>|<|<=|>=|!=)/i).map(string => string.trim());
    let parsedString = [];
    for (let i = 0; i < splitString.length; i++) {
        const string = splitString[i];
        if ((i % 4) == 0) {
            if (knownColumns.includes(string.toUpperCase())){
                parsedString.push(string);
            }

        } if ((i % 4) == 1) {
            if (knownOperators.includes(string)){
                parsedString.push(string);
            }
        }
        if ((i % 4) == 2) {
            let cond = "'";
            cond += string;
            cond += "'";
            console.log(cond);
            parsedString.push(cond);
        } else {
            if (andAndOr.includes(string.toUpperCase())) {
                parsedString.push(string);
            }
        }
    }
    return parsedString;
}

async function selectTableFromDB(string) {
    const sqlConditions = parseSelection(string).join(" ");
    let sql = `SELECT * FROM DoTask WHERE `;
    sql += sqlConditions;
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(sql
        );
        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function groupByAggregation(string) {
    let sql = `SELECT ?, COUNT(*) FROM DoTask GROUP BY ?`;
    let replaceSql = sql.replace("?", string );
    let query = replaceSql.replace("?", string);
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(query);
        return result.rows;
    }).catch(() => {
        return false;
    });
}

module.exports = {
    testOracleConnection,
    fetchPeopleFromDb,
    fetchUtilityBillProviderFromDb,
    fetchItemsFromDb,
    fetchConsumedItemsFromDb,
    fetchComplaintsFromDb,
    fetchUtilityBillFromDb,
    fetchAccountsFromDb,
    insertPeople,
    updateUtilityBillServiceProvider,
    getQualityItems,
    countComplaintsGreaterThan5,
    getItemsConsumedByAll,
    removePerson,
    getAvailablePeopleFromDB,
    listTransactionsFromID,
    fetchDoTaskFromDb,
    insertDemotable,
    selectTableFromDB,
    groupByAggregation,
    updateAccountBudget
};