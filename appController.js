const express = require('express');
const appService = require('./appService');
const messages = require('./utils/messages');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});


// fetch all data from table
router.get('/people', async (req, res) => {
    const tableContent = await appService.fetchPeopleFromDb();
    if (tableContent) {
        res.json({
            success: true,
            data: tableContent
        });
    } else {
        res.json({ 
            success: false,
            errorMsg: messages.FETCH_PEOPLE_ERROR
        });
    }
});

router.get('/utilityBillProvider', async (req, res) => {
    const tableContent = await appService.fetchUtilityBillProviderFromDb();
    if (tableContent) {
        res.json({
            success: true,
            data: tableContent
        });
    } else {
        res.json({ 
            success: false,
            errorMsg: messages.FETCH_UTILITYBILLPROVIDER_ERROR
        });
    }
});

router.get('/utilityBill', async (req, res) => {
    const tableContent = await appService.fetchUtilityBillFromDb();
    if (tableContent) {
        res.json({
            success: true,
            data: tableContent
        });
    } else {
        res.json({ 
            success: false,
            errorMsg: messages.FETCH_UTILITYBILL_ERROR
        });
    }
});

router.get('/items', async (req, res) => {
    const tableContent = await appService.fetchItemsFromDb();
    if (tableContent) {
        res.json({
            success: true,
            data: tableContent
        });
    } else {
        res.json({ 
            success: false,
            errorMsg: messages.FETCH_ITEMS_ERROR
        });
    }
});

router.get('/complaints', async (req, res) => {
    const tableContent = await appService.fetchComplaintsFromDb();
    if (tableContent) {
        res.json({
            success: true,
            data: tableContent
        });
    } else {
        res.json({ 
            success: false,
            errorMsg: messages.FETCH_COMPLAINTS_ERROR
        });
    }
});

router.get('/consume', async (req, res) => {
    const tableContent = await appService.fetchConsumedItemsFromDb();
    if (tableContent) {
        res.json({
            success: true,
            data: tableContent
        });
    } else {
        res.json({ 
            success: false,
            errorMsg: messages.FETCH_CONSUME_ERROR
        });
    }
});

router.get('/accounts', async (req, res) => {
    const tableContent = await appService.fetchAccountsFromDb();
    if (tableContent) {
        res.json({
            success: true,
            data: tableContent
        });
    } else {
        res.json({ 
            success: false,
            errorMsg: messages.FETCH_POSSESSACCOUNTS_ERROR
        });
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDoTaskFromDb();
    if (tableContent) {
        res.json({
            success: true,
            data: tableContent
        });
    } else {
        res.json({ 
            success: false,
            errorMsg: messages.FETCH_DOTASK_ERROR
        });
    }
});

router.post("/insert-people", async (req, res) => {
    const { id, name, dob, employer, phoneNumber, assignedRoom } = req.body;
    const insertResult = await appService.insertPeople(id, name, dob, employer, phoneNumber, assignedRoom);
    if (insertResult) {
        res.json({
            success: true
        });
    } else {
        res.json({ 
            success: false,
            errorMsg: messages.PEOPLE_INSERT_ERROR
        });
    }
});

router.post("/update-utility-bill-provider", async (req, res) => {
    const { newServiceProvider, billName } = req.body;
    const updateResult = await appService.updateUtilityBillServiceProvider(newServiceProvider, billName);
    if (updateResult) {
        res.json({
            success: true
        });
    } else {
        res.json({ 
            success: false,
            errorMsg: messages.BILL_PROVIDER_UPDATE_ERROR
        });
    }
});

router.post("/update-account-budget", async (req, res) => {
    const { accountID, updateColumn, newValue } = req.body;
    const updateResult = await appService.updateAccountBudget(accountID, updateColumn, newValue);
    if (updateResult) {
        res.json({
            success: true
        });
    } else {
        res.json({ 
            success: false,
            errorMsg: messages.ACCOUNT_UPDATE_ERROR
        });
    }
});

router.get('/select-poor-items', async (req, res) => {
    const { projection, qualityAttribute } = req.query;
    const tableCount = await appService.getQualityItems(projection, qualityAttribute);
    if (tableCount) {
        res.json({
            success: true,
            count: tableCount
        });
    } else {
        res.json({ 
            success: false,
            errorMsg: messages.GET_QUALITY_ITEMS_ERROR
        });
    }
});

router.get('/select-count-complaint', async (req, res) => {
    const complaintCount = await appService.countComplaintsGreaterThan5();
    if (complaintCount) {
        res.json({
            success: true,
            count: complaintCount
        });
    } else {
        res.json({ 
            success: false,
            errorMsg: messages.COMPLAINT_COUNT_ERROR
        });
    }
});

router.get('/select-items-consumed-by-all', async (req, res) => {
    const consumedItems = await appService.getItemsConsumedByAll();
    if (consumedItems) {
        res.json({
            success: true,
            table: consumedItems
        });
    } else {
        res.json({ 
            success: false,
            errorMsg: messages.CONSUMED_BY_ALL_ERROR
        });
    }
});

router.get('/available-people-table', async (req, res) => {
    const tableContent = await appService.getAvailablePeopleFromDB();
    if (tableContent) {
        res.json({
            success: true,
            data: tableContent
        });
    } else {
        res.json({ 
            success: false,
            errorMsg: messages.AVAILABLE_PEOPLE_ERROR
        });
    }
});

router.get("/find-people-transactions", async (req, res) => {
    const { id } = req.query;
    const personTransactionResults = await appService.listTransactionsFromID(id);
    if (personTransactionResults) {
        res.json({
            success: true,
            data: personTransactionResults
        });
    } else {
        res.json({ 
            success: false,
            errorMsg: messages.TRACK_TRANSACTIONS_ERROR
        });
    }
});

router.post("/remove-people", async (req, res) => {
    const { id } = req.body;
    const removeResult = await appService.removePerson(id);
    if (removeResult) {
        res.json({ success: true });
    } else {
        res.json({ success: false, errorMsg: messages.DELETE_PERSON_ERROR  });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { taskname, dateadded, location, personid } = req.body;
    const insertResult = await appService.insertDemotable(taskname, dateadded, location, personid);
    if (insertResult) {
        res.json({
            success: true
        });
    } else {
        res.json({ 
            success: false,
            errorMsg: messages.TASK_INSERT_ERROR
        });
    }
});

router.post("/selectTable", async (req, res) => {
    const { string } = req.body;
    const tableContent = await appService.selectTableFromDB(string);
    if (tableContent) {
        res.json({
            success: true,
            data: tableContent
        });
    } else {
        res.json({ 
            success: false,
            errorMsg: messages.TASK_SELECTION_ERROR
        });
    }
});

router.post('/groupBy', async (req, res) => {
    const { string } = req.body;
    const tableContent = await appService.groupByAggregation(string);
    if (tableContent) {
        res.json({
            success: true,
            data: tableContent
        });
    } else {
        res.json({ 
            success: false,
            errorMsg: messages.TASK_AGGREGATION_ERROR
        });
    }
});


module.exports = router;