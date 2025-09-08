DROP TABLE COMMONSPACES CASCADE CONSTRAINTS;
DROP TABLE BEDROOMTYPES CASCADE CONSTRAINTS;
DROP TABLE BEDROOM CASCADE CONSTRAINTS;
DROP TABLE EMPLOYMENT CASCADE CONSTRAINTS;
DROP TABLE PEOPLE CASCADE CONSTRAINTS;
DROP TABLE DOTASK CASCADE CONSTRAINTS;
DROP TABLE PETTYPES CASCADE CONSTRAINTS;
DROP TABLE OWNPET CASCADE CONSTRAINTS;
DROP TABLE COMPLAINTSEVERITY CASCADE CONSTRAINTS;
DROP TABLE FILECOMPLAINT CASCADE CONSTRAINTS;
DROP TABLE ITEMQUALITY CASCADE CONSTRAINTS;
DROP TABLE ITEMS CASCADE CONSTRAINTS;
DROP TABLE STORE CASCADE CONSTRAINTS;
DROP TABLE CONSUME CASCADE CONSTRAINTS;
DROP TABLE EXPENSEPRICE CASCADE CONSTRAINTS;
DROP TABLE EXPENSE CASCADE CONSTRAINTS;
DROP TABLE UTILITYBILLPROVIDER CASCADE CONSTRAINTS;
DROP TABLE UTILITYBILLCOST CASCADE CONSTRAINTS;
DROP TABLE UTILITYBILL CASCADE CONSTRAINTS;
DROP TABLE INCUR CASCADE CONSTRAINTS;
DROP TABLE POSSESSACCOUNT CASCADE CONSTRAINTS;
DROP TABLE EXPENSESTATUS CASCADE CONSTRAINTS;
DROP TABLE TRACK CASCADE CONSTRAINTS;
DROP TABLE EVERYONENUMTASKS CASCADE CONSTRAINTS; -- note this is a view

-- room tables
CREATE TABLE CommonSpaces (
	room# INT,
	floorLevel INT NOT NULL,
	squareFootage INT NOT NULL,
	roomType VARCHAR(255) NOT NULL,
	PRIMARY KEY (room#)
);

CREATE TABLE BedroomTypes (
	bedroomType VARCHAR(255) PRIMARY KEY,
	occupancy INT NOT NULL	
);

CREATE TABLE Bedroom (
	room# INT PRIMARY KEY,
	floorLevel INT NOT NULL,
	squareFootage INT NOT NULL,
	bedroomType VARCHAR(255) NOT NULL,
	FOREIGN KEY (bedroomType) REFERENCES BedroomTypes ON DELETE CASCADE
);

-- people tables
CREATE TABLE Employment (
	employer VARCHAR(255) PRIMARY KEY,
	employmentStatus VARCHAR(255) NOT NULL	
);

CREATE TABLE People (
	ID# INT PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	DOB DATE,
	employer VARCHAR(255) NOT NULL,
	phoneNumber INT UNIQUE NOT NULL,
	assignedRoom INT NOT NULL,
	FOREIGN KEY (assignedRoom) REFERENCES Bedroom(room#) ON DELETE CASCADE,
	FOREIGN KEY (employer) REFERENCES Employment(employer) ON DELETE CASCADE	
);

-- task table
CREATE TABLE DoTask ( 
	taskName VARCHAR(255), 
	dateAdded DATE, 
	location VARCHAR(255), 
	personID# INTEGER NOT NULL, 
	PRIMARY KEY (taskName, dateAdded), 
	FOREIGN KEY (personID#) REFERENCES People ON DELETE CASCADE
);

-- pet tables
CREATE TABLE PetTypes (
	breed VARCHAR(255),
	type VARCHAR(255) NOT NULL,
	PRIMARY KEY (breed)		
);

CREATE TABLE OwnPet (
	ownerID# INT,
	name VARCHAR(255),
	breed VARCHAR(255) NOT NULL,
	PRIMARY KEY (ownerID#, name),
	FOREIGN KEY (ownerID#) REFERENCES People ON DELETE CASCADE,
	FOREIGN KEY (breed) REFERENCES PetTypes ON DELETE CASCADE
);

-- complaint tables
CREATE TABLE ComplaintSeverity (
	details VARCHAR(255),
	severity VARCHAR(255) NOT NULL,
	PRIMARY KEY (details)	
);

CREATE TABLE FileComplaint (
	complaintID# INT PRIMARY KEY,
	fromPersonID# INT NOT NULL,
	toPersonID# INT,
	details VARCHAR(255) NOT NULL,
	FOREIGN KEY (fromPersonID#) REFERENCES People ON DELETE CASCADE,
	FOREIGN KEY (toPersonID#) REFERENCES People ON DELETE CASCADE,
	FOREIGN KEY (details) REFERENCES ComplaintSeverity ON DELETE CASCADE		
);

-- item tables
CREATE TABLE ItemQuality (
	expiryDate DATE,
	quality VARCHAR(255) NOT NULL,
	PRIMARY KEY (expiryDate)
);	

CREATE TABLE Items (
	name VARCHAR(255),
	dateAcquired DATE,
	price DECIMAL(10,2),
	quantity INT NOT NULL,
	expiryDate DATE,
	storageType VARCHAR(255), 
	PRIMARY KEY (name, dateAcquired),
	FOREIGN KEY (expiryDate) REFERENCES ITEMQUALITY ON DELETE CASCADE
);

-- store table
CREATE TABLE Store (
	room# INT,
	itemName VARCHAR(255),
	dateAcquired DATE,
	PRIMARY KEY (room#, itemName, dateAcquired),
	FOREIGN KEY (room#) REFERENCES CommonSpaces ON DELETE CASCADE,
	FOREIGN KEY (itemName, dateAcquired) REFERENCES Items ON DELETE CASCADE		
);

-- consume table
CREATE TABLE Consume (
	personID# INT,
	itemName VARCHAR(255),
	dateAcquired DATE,
	dateConsumed DATE,
	PRIMARY KEY (personID#, itemName, dateAcquired),
	FOREIGN KEY (personID#) REFERENCES People ON DELETE CASCADE,
	FOREIGN KEY (itemName, dateAcquired) REFERENCES Items ON DELETE CASCADE
);

-- expense tables
CREATE TABLE ExpensePrice (
	description VARCHAR(255),
	dateAdded DATE,
	totalPrice DECIMAL(10,2) NOT NULL,
	PRIMARY KEY (description, dateAdded)	
);

CREATE TABLE Expense (
	transactionID# INT PRIMARY KEY,
	description VARCHAR(255) NOT NULL,
	dateAdded DATE NOT NULL,
	UNIQUE (description, dateAdded),
	FOREIGN KEY (description, dateAdded) REFERENCES ExpensePrice ON DELETE CASCADE	
);

-- incur table
CREATE TABLE Incur(
	itemName VARCHAR(255),
	dateAcquired DATE,
	transactionID# INT,
	PRIMARY KEY (itemName, dateAcquired, transactionID#),
	FOREIGN KEY (itemName, dateAcquired) REFERENCES Items ON DELETE CASCADE,
	FOREIGN KEY (transactionID#) REFERENCES Expense ON DELETE CASCADE		
);

-- utilitybill tables
CREATE TABLE UtilityBillProvider(
	name VARCHAR(255) PRIMARY KEY,	
	serviceProviderPlan VARCHAR(255) NOT NULL
);

CREATE TABLE UtilityBillCost(
	name VARCHAR(255) PRIMARY KEY,
	cost DECIMAL(10,2) NOT NULL,
	FOREIGN KEY (name) REFERENCES UTILITYBILLPROVIDER ON DELETE CASCADE
);

CREATE TABLE UtilityBill(
	name VARCHAR(255),
	dueDate DATE,
	transactionID# INTEGER NOT NULL,
	periodStartDate DATE NOT NULL,
	periodEndDate DATE NOT NULL,
	PRIMARY KEY (name, dueDate),
	FOREIGN KEY (transactionID#) REFERENCES Expense (transactionID#) ON DELETE CASCADE,
	FOREIGN KEY (name) REFERENCES UTILITYBILLPROVIDER ON DELETE CASCADE
);

-- account tables
CREATE TABLE PossessAccount(
	accountID# INT PRIMARY KEY,
	ownerID# INT NOT NULL UNIQUE,
	budget DECIMAL(10,2) NOT NULL,
	totalExpenses DECIMAL(10,2) NOT NULL,
	FOREIGN KEY (ownerID#) REFERENCES People ON DELETE CASCADE		
);

CREATE TABLE ExpenseStatus(
	paidAmount DECIMAL(10,2),
	splitCost DECIMAL(10,2),
	status VARCHAR(255) NOT NULL,
	PRIMARY KEY (paidAmount, splitCost)
);

CREATE TABLE Track (
	accountID# INT,
	transactionID# INT,
	paidAmount DECIMAL(10,2) NOT NULL,
	splitCost DECIMAL(10,2) NOT NULL,
	PRIMARY KEY (accountID#, transactionID#),
	UNIQUE (paidAmount, splitCost),
	FOREIGN KEY (accountID#) REFERENCES PossessAccount ON DELETE CASCADE,
	FOREIGN KEY (transactionID#) REFERENCES Expense ON DELETE CASCADE,
	FOREIGN KEY (paidAmount, splitCost) REFERENCES ExpenseStatus ON DELETE CASCADE
);

INSERT INTO CommonSpaces(room#, floorLevel, squareFootage, roomType) VALUES (6, 1, 180, 'Kitchen');
INSERT INTO CommonSpaces(room#, floorLevel, squareFootage, roomType) VALUES (7, 1, 100, 'Laundry');
INSERT INTO CommonSpaces(room#, floorLevel, squareFootage, roomType) VALUES (8, 1, 50, 'Bathroom');
INSERT INTO CommonSpaces(room#, floorLevel, squareFootage, roomType) VALUES (9, 2, 50, 'Bathroom');
INSERT INTO CommonSpaces(room#, floorLevel, squareFootage, roomType) VALUES (10, 1, 210, 'Living room');
INSERT INTO CommonSpaces(room#, floorLevel, squareFootage, roomType) VALUES (11, 1, 160, 'Dining room');
INSERT INTO CommonSpaces(room#, floorLevel, squareFootage, roomType) VALUES (12, 1, 20, 'Pantry room');
INSERT INTO CommonSpaces(room#, floorLevel, squareFootage, roomType) VALUES (13, 0, 500, 'Basement');

INSERT INTO BedroomTypes(bedroomType, occupancy) VALUES ('Twin', 1);
INSERT INTO BedroomTypes(bedroomType, occupancy) VALUES ('Two Twin', 2);
INSERT INTO BedroomTypes(bedroomType, occupancy) VALUES ('Double', 2);
INSERT INTO BedroomTypes(bedroomType, occupancy) VALUES ('Queen', 2);
INSERT INTO BedroomTypes(bedroomType, occupancy) VALUES ('King', 3);

INSERT INTO Bedroom(room#, floorLevel, squareFootage, bedroomType) VALUES (1, 1, 49, 'Twin');
INSERT INTO Bedroom(room#, floorLevel, squareFootage, bedroomType) VALUES (2, 1, 86, 'Double');
INSERT INTO Bedroom(room#, floorLevel, squareFootage, bedroomType) VALUES (3, 2, 81, 'Two Twin');
INSERT INTO Bedroom(room#, floorLevel, squareFootage, bedroomType) VALUES (4, 2, 109, 'King');
INSERT INTO Bedroom(room#, floorLevel, squareFootage, bedroomType) VALUES (5, 2, 96, 'Queen');

INSERT INTO Employment(employer, employmentStatus) VALUES ('Walmart', 'Employed');
INSERT INTO Employment(employer, employmentStatus) VALUES ('Cocos', 'Employed');
INSERT INTO Employment(employer, employmentStatus) VALUES ('Coffee and Vanilla Cafe', 'Employed');
INSERT INTO Employment(employer, employmentStatus) VALUES ('SAP', 'Employed');
INSERT INTO Employment(employer, employmentStatus) VALUES ('Vancity', 'Employed');
INSERT INTO Employment(employer, employmentStatus) VALUES ('None', 'Unemployed');

INSERT INTO People(ID#, name, DOB, employer, phoneNumber, assignedRoom) VALUES (1, 'John', DATE '1988-01-01', 'Walmart', 6041111111, 1);
INSERT INTO People(ID#, name, DOB, employer, phoneNumber, assignedRoom) VALUES (2, 'Mary', DATE '1998-11-22', 'Coffee and Vanilla Cafe', 7782222222, 2);
INSERT INTO People(ID#, name, DOB, employer, phoneNumber, assignedRoom) VALUES (3, 'Larry', DATE '1988-01-01', 'Cocos', 6043333333, 3);
INSERT INTO People(ID#, name, DOB, employer, phoneNumber, assignedRoom) VALUES (4, 'Sophia', DATE '1988-01-01', 'SAP', 6044444444, 4);
INSERT INTO People(ID#, name, DOB, employer, phoneNumber, assignedRoom) VALUES (5, 'Lisa', DATE '1988-01-01', 'Vancity', 6045555555, 5);
INSERT INTO People(ID#, name, DOB, employer, phoneNumber, assignedRoom) VALUES (6, 'Joe', DATE '1847-01-01', 'None', 6041115542, 5);
INSERT INTO People(ID#, name, DOB, employer, phoneNumber, assignedRoom) VALUES (7, 'Jane', DATE '1847-05-05', 'None', 6041115547, 4);

INSERT INTO DoTask(taskName, dateAdded, location, personID#) VALUES ('Bake cake', DATE '2024-01-01', 'Kitchen', 3);
INSERT INTO DoTask(taskName, dateAdded, location, personID#) VALUES ('Wash Dishes', DATE '2024-01-27', 'Kitchen', 2);
INSERT INTO DoTask(taskName, dateAdded, location, personID#) VALUES ('Take out trash', DATE '2024-01-27', 'Kitchen', 2);
INSERT INTO DoTask(taskName, dateAdded, location, personID#) VALUES ('Mow Lawn', DATE '2024-02-01', 'Backyard', 4);
INSERT INTO DoTask(taskName, dateAdded, location, personID#) VALUES ('Buy groceries', DATE '2024-02-01', 'Superstore', 5);
INSERT INTO DoTask(taskName, dateAdded, location, personID#) VALUES ('Clean the windows', DATE '2024-02-01', 'Living Room', 2);
INSERT INTO DoTask(taskName, dateAdded, location, personID#) VALUES ('Dust the shelves', DATE '2024-02-01', 'Living Room', 2);
INSERT INTO DoTask(taskName, dateAdded, location, personID#) VALUES ('Vacuum carpet', DATE '2024-02-01', 'Living Room', 2);
INSERT INTO DoTask(taskName, dateAdded, location, personID#) VALUES ('Wash Dishes', DATE '2024-02-01', 'Kitchen', 4);
INSERT INTO DoTask(taskName, dateAdded, location, personID#) VALUES ('Cook Food', DATE '2024-02-23', 'Kitchen', 2);
INSERT INTO DoTask(taskName, dateAdded, location, personID#) VALUES ('Water Plants', DATE '2024-02-23', 'Outside', 3);
INSERT INTO DoTask(taskName, dateAdded, location, personID#) VALUES ('Clean gutters', DATE '2024-02-23', 'Outside', 3);
INSERT INTO DoTask(taskName, dateAdded, location, personID#) VALUES ('Water Plants', DATE '2024-03-24', 'Outside', 6);
INSERT INTO DoTask(taskName, dateAdded, location, personID#) VALUES ('Water Plants', DATE '2024-04-01', 'Outside', 3);
INSERT INTO DoTask(taskName, dateAdded, location, personID#) VALUES ('Change bedsheets', DATE '2024-04-13', 'Bedroom', 2);
INSERT INTO DoTask(taskName, dateAdded, location, personID#) VALUES ('Buy groceries', DATE '2024-05-01', 'Superstore', 4);
INSERT INTO DoTask(taskName, dateAdded, location, personID#) VALUES ('Buy new furniture', DATE '2024-05-01', 'The Brick', 4);
INSERT INTO DoTask(taskName, dateAdded, location, personID#) VALUES ('Deliver wrong package', DATE '2024-05-01', 'Post Canada', 4);
INSERT INTO DoTask(taskName, dateAdded, location, personID#) VALUES ('Investigate suspicious noise', DATE '2024-06-05', 'Basement', 1);
INSERT INTO DoTask(taskName, dateAdded, location, personID#) VALUES ('Walk dog', DATE '2024-07-12', 'Outside', 1);
INSERT INTO DoTask(taskName, dateAdded, location, personID#) VALUES ('Bury former roommate', DATE '2024-07-12', 'Outside', 1);
INSERT INTO DoTask(taskName, dateAdded, location, personID#) VALUES ('Rake the leaves', DATE '2024-10-25', 'Outside', 3);
INSERT INTO DoTask(taskName, dateAdded, location, personID#) VALUES ('Clean Bathroom', DATE '2024-11-01', 'Bathroom', 1);

INSERT INTO PetTypes(breed, type) VALUES ('Ragdoll', 'Cat');
INSERT INTO PetTypes(breed, type) VALUES ('Siamese', 'Cat');
INSERT INTO PetTypes(breed, type) VALUES ('Bombay', 'Cat');
INSERT INTO PetTypes(breed, type) VALUES ('Australian Shepard', 'Dog');
INSERT INTO PetTypes(breed, type) VALUES ('Betta', 'Fish');

INSERT INTO OwnPet(ownerID#, name, breed) VALUES (1, 'Henry', 'Australian Shepard');
INSERT INTO OwnPet(ownerID#, name, breed) VALUES (1, 'Oliver', 'Bombay');
INSERT INTO OwnPet(ownerID#, name, breed) VALUES (5, 'Bluey', 'Betta');
INSERT INTO OwnPet(ownerID#, name, breed) VALUES (5, 'Loki', 'Bombay');
INSERT INTO OwnPet(ownerID#, name, breed) VALUES (5, 'Moon', 'Siamese');

INSERT INTO ComplaintSeverity(details, severity) VALUES ('Smelly room', 'minor');
INSERT INTO ComplaintSeverity(details, severity) VALUES ('Noise complaint', 'moderate');
INSERT INTO ComplaintSeverity(details, severity) VALUES ('Broke window', 'major');
INSERT INTO ComplaintSeverity(details, severity) VALUES ('Killed my roommate', 'extreme');
INSERT INTO ComplaintSeverity(details, severity) VALUES ('Didnt flush toilet', 'moderate');

INSERT INTO ComplaintSeverity(details, severity) VALUES ('Forgot groceries outside', 'moderate');
INSERT INTO ComplaintSeverity(details, severity) VALUES ('Left dishes in sink', 'moderate');
INSERT INTO ComplaintSeverity(details, severity) VALUES ('Left dirty clothes in washing machine', 'moderate');
INSERT INTO ComplaintSeverity(details, severity) VALUES ('Broke my computer', 'extreme');
INSERT INTO ComplaintSeverity(details, severity) VALUES ('Spilled litter', 'minor');
INSERT INTO ComplaintSeverity(details, severity) VALUES ('Brought guest over without permission', 'minor');
INSERT INTO ComplaintSeverity(details, severity) VALUES ('Stuck something on my clothes', 'minor');
INSERT INTO ComplaintSeverity(details, severity) VALUES ('Borrowed car without permission', 'major');
INSERT INTO ComplaintSeverity(details, severity) VALUES ('Stole my food', 'extreme');
INSERT INTO ComplaintSeverity(details, severity) VALUES ('Forgot to throw away garbage', 'minor');
INSERT INTO ComplaintSeverity(details, severity) VALUES ('Didnt finish chores', 'minor');
INSERT INTO ComplaintSeverity(details, severity) VALUES ('Left door unlocked', 'major');
INSERT INTO ComplaintSeverity(details, severity) VALUES ('Left keys on doorknob', 'major');
INSERT INTO ComplaintSeverity(details, severity) VALUES ('Trashed my room', 'major');

INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (100, 1, 2, 'Didnt flush toilet');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (101, 1, 2, 'Noise complaint');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (102, 2, 3, 'Smelly room');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (103, 4, 5, 'Broke window');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (104, 1, 2, 'Killed my roommate');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (105, 1, 5, 'Forgot groceries outside');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (106, 1, 5, 'Left dishes in sink');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (107, 2, 5, 'Left dirty clothes in washing machine');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (108, 4, 5, 'Broke my computer');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (109, 1, 2, 'Spilled litter');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (110, 1, 5, 'Left dishes in sink');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (111, 1, 2, 'Brought guest over without permission');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (112, 2, 3, 'Stuck something on my clothes');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (113, 4, 5, 'Borrowed car without permission');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (114, 1, 2, 'Stole my food');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (115, 1, 5, 'Forgot to throw away garbage');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (116, 1, 2, 'Didnt finish chores');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (117, 2, 3, 'Left door unlocked');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (118, 4, 5, 'Left keys on doorknob');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (119, 4, 2, 'Stole my food');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (120, 5, 3, 'Trashed my room');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (121, 6, 4, 'Stole my food');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (122, 1, 5, 'Left keys on doorknob');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (123, 1, 6, 'Stole my food');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (124, 2, 6, 'Stole my food');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (125, 3, 6, 'Stole my food');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (126, 4, 6, 'Stole my food');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (127, 5, 6, 'Stole my food');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (128, 7, 6, 'Stole my food');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (129, 1, 3, 'Brought guest over without permission');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (130, 2, 3, 'Broke window');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (131, 7, 3, 'Left keys on doorknob');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (132, 7, 3, 'Left dishes in sink');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (133, 1, 7, 'Left dishes in sink');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (134, 2, 7, 'Left dishes in sink');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (135, 3, 7, 'Left dishes in sink');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (136, 4, 7, 'Left dishes in sink');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (137, 5, 7, 'Left dishes in sink');
INSERT INTO FileComplaint(complaintID#, fromPersonID#, toPersonID#, details) VALUES (138, 6, 7, 'Left dishes in sink');

INSERT INTO ItemQuality(expiryDate, quality) VALUES (DATE '2024-11-22', 'Excellent');
INSERT INTO ItemQuality(expiryDate, quality) VALUES (DATE '2024-11-28', 'Excellent');
INSERT INTO ItemQuality(expiryDate, quality) VALUES (DATE '2024-10-10', 'Good');
INSERT INTO ItemQuality(expiryDate, quality) VALUES (DATE '2024-09-22', 'Spoiled');
INSERT INTO ItemQuality(expiryDate, quality) VALUES (DATE '2024-08-11', 'Spoiled');

INSERT INTO Items(name, dateAcquired, price, quantity, expiryDate, storageType) VALUES ('Dog Food', DATE '2024-11-12', 70.99, 2, DATE '2024-11-22', 'Fridge');
INSERT INTO Items(name, dateAcquired, price, quantity, expiryDate, storageType) VALUES ('Cat Food', DATE '2024-11-18', 50.99, 15, DATE '2024-11-28', 'Fridge');
INSERT INTO Items(name, dateAcquired, price, quantity, expiryDate, storageType) VALUES ('Toilet Paper', DATE '2024-11-28', 23.99, 19, NULL, NULL);
INSERT INTO Items(name, dateAcquired, price, quantity, expiryDate, storageType) VALUES ('Dish soap', DATE '2024-11-28', 7.50, 5, NULL, NULL);
INSERT INTO Items(name, dateAcquired, price, quantity, expiryDate, storageType) VALUES ('Apples', DATE '2024-10-01', 1.99, 6, DATE '2024-10-10', 'Open Shelving');
INSERT INTO Items(name, dateAcquired, price, quantity, expiryDate, storageType) VALUES ('Bananas', DATE '2024-09-12', 2.50, 4, DATE '2024-09-22', 'Open Shelving');
INSERT INTO Items(name, dateAcquired, price, quantity, expiryDate, storageType) VALUES ('Oranges', DATE '2024-08-01', 12.99, 10, DATE '2024-08-11', 'Open Shelving');
INSERT INTO Items(name, dateAcquired, price, quantity, expiryDate, storageType) VALUES ('Mangoes', DATE '2024-10-01', 9.99, 6, DATE '2024-10-10', 'Open Shelving');
INSERT INTO Items(name, dateAcquired, price, quantity, expiryDate, storageType) VALUES ('Cherries', DATE '2024-09-12', 12.50, 4, DATE '2024-09-22', 'Open Shelving');
INSERT INTO Items(name, dateAcquired, price, quantity, expiryDate, storageType) VALUES ('Plums', DATE '2024-08-01', 15.99, 10, DATE '2024-08-11', 'Open Shelving');

INSERT INTO Store(room#, itemName, dateAcquired) VALUES (6, 'Cat Food', DATE '2024-11-18');
INSERT INTO Store(room#, itemName, dateAcquired) VALUES (6, 'Dog Food', DATE '2024-11-12');
INSERT INTO Store(room#, itemName, dateAcquired) VALUES (11, 'Apples', DATE '2024-10-01');
INSERT INTO Store(room#, itemName, dateAcquired) VALUES (11, 'Bananas', DATE '2024-09-12');
INSERT INTO Store(room#, itemName, dateAcquired) VALUES (11, 'Oranges', DATE '2024-08-01');
INSERT INTO Store(room#, itemName, dateAcquired) VALUES (11, 'Mangoes', DATE '2024-10-01');
INSERT INTO Store(room#, itemName, dateAcquired) VALUES (11, 'Cherries', DATE '2024-09-12');
INSERT INTO Store(room#, itemName, dateAcquired) VALUES (11, 'Plums', DATE '2024-08-01');

INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (1, 'Dog Food', DATE '2024-11-12', DATE '2024-05-30');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (1, 'Cat Food', DATE '2024-11-18', DATE '2024-05-31');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (1, 'Toilet Paper', DATE '2024-11-28', DATE '2022-01-30');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (2, 'Toilet Paper', DATE '2024-11-28', DATE '2022-01-30');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (3, 'Toilet Paper', DATE '2024-11-28', DATE '2022-01-30');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (4, 'Toilet Paper', DATE '2024-11-28', DATE '2022-01-30');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (5, 'Toilet Paper', DATE '2024-11-28', DATE '2022-01-30');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (6, 'Toilet Paper', DATE '2024-11-28', DATE '2022-01-30');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (7, 'Toilet Paper', DATE '2024-11-28', DATE '2022-01-30');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (3, 'Dish soap', DATE '2024-11-28', DATE '2024-12-01');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (1, 'Bananas', DATE '2024-09-12', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (2, 'Bananas', DATE '2024-09-12', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (3, 'Bananas', DATE '2024-09-12', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (4, 'Bananas', DATE '2024-09-12', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (5, 'Bananas', DATE '2024-09-12', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (6, 'Bananas', DATE '2024-09-12', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (7, 'Bananas', DATE '2024-09-12', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (1, 'Oranges', DATE '2024-08-01', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (2, 'Oranges', DATE '2024-08-01', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (3, 'Oranges', DATE '2024-08-01', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (4, 'Oranges', DATE '2024-08-01', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (5, 'Oranges', DATE '2024-08-01', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (6, 'Oranges', DATE '2024-08-01', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (7, 'Oranges', DATE '2024-08-01', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (1, 'Mangoes', DATE '2024-10-01', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (2, 'Mangoes', DATE '2024-10-01', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (3, 'Mangoes', DATE '2024-10-01', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (4, 'Mangoes', DATE '2024-10-01', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (5, 'Mangoes', DATE '2024-10-01', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (6, 'Mangoes', DATE '2024-10-01', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (7, 'Mangoes', DATE '2024-10-01', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (1, 'Cherries', DATE '2024-09-12', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (2, 'Cherries', DATE '2024-09-12', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (3, 'Cherries', DATE '2024-09-12', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (4, 'Cherries', DATE '2024-09-12', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (5, 'Cherries', DATE '2024-09-12', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (6, 'Cherries', DATE '2024-09-12', DATE '2023-09-23');
INSERT INTO Consume(personID#, itemName, dateAcquired, dateConsumed) VALUES (7, 'Cherries', DATE '2024-09-12', DATE '2023-09-23');

INSERT INTO ExpensePrice(description, dateAdded, totalPrice) VALUES ('Shared Pet Food', DATE '2024-08-10', 103.88);
INSERT INTO ExpensePrice(description, dateAdded, totalPrice) VALUES ('Necessities', DATE '2024-09-20', 50.60);
INSERT INTO ExpensePrice(description, dateAdded, totalPrice) VALUES ('Shared Snacks', DATE '2024-09-20', 32.80);
INSERT INTO ExpensePrice(description, dateAdded, totalPrice) VALUES ('November Utility Bills', DATE '2024-11-13', 388.13);
INSERT INTO ExpensePrice(description, dateAdded, totalPrice) VALUES ('Rent Bill', DATE '2024-10-24', 960.00);
INSERT INTO ExpensePrice(description, dateAdded, totalPrice) VALUES ('Family Plan Phone Bill', DATE '2024-11-12', 160.05);
INSERT INTO ExpensePrice(description, dateAdded, totalPrice) VALUES ('Joe Phone Bill', DATE '2024-11-10', 59.61);
INSERT INTO ExpensePrice(description, dateAdded, totalPrice) VALUES ('Decorative Pillows', DATE '2024-11-29', 50.00);
INSERT INTO ExpensePrice(description, dateAdded, totalPrice) VALUES ('Shovel', DATE '2024-11-29', 37.42);
INSERT INTO ExpensePrice(description, dateAdded, totalPrice) VALUES ('Shared Snacks', DATE '2024-11-14', 16.31);

INSERT INTO Expense(transactionID#, description, dateAdded) VALUES (1, 'Shared Pet Food', DATE '2024-08-10');
INSERT INTO Expense(transactionID#, description, dateAdded) VALUES (2, 'Necessities', DATE '2024-09-20');
INSERT INTO Expense(transactionID#, description, dateAdded) VALUES (3, 'Shared Snacks', DATE '2024-09-20');
INSERT INTO Expense(transactionID#, description, dateAdded) VALUES (4, 'November Utility Bills', DATE '2024-11-13');
INSERT INTO Expense(transactionID#, description, dateAdded) VALUES (5, 'Rent Bill', DATE '2024-10-24');
INSERT INTO Expense(transactionID#, description, dateAdded) VALUES (6, 'Family Plan Phone Bill', DATE '2024-11-12');
INSERT INTO Expense(transactionID#, description, dateAdded) VALUES (7, 'Joe Phone Bill', DATE '2024-11-10');
INSERT INTO Expense(transactionID#, description, dateAdded) VALUES (10, 'Decorative Pillows', DATE '2024-11-29');
INSERT INTO Expense(transactionID#, description, dateAdded) VALUES (11, 'Shovel', DATE '2024-11-29');
INSERT INTO Expense(transactionID#, description, dateAdded) VALUES (12, 'Shared Snacks', DATE '2024-11-14');

INSERT INTO Incur(itemName, dateAcquired, transactionID#) VALUES ('Dog Food', DATE '2024-11-12', 1);
INSERT INTO Incur(itemName, dateAcquired, transactionID#) VALUES ('Cat Food', DATE '2024-11-18', 1);
INSERT INTO Incur(itemName, dateAcquired, transactionID#) VALUES ('Toilet Paper', DATE '2024-11-28', 2);
INSERT INTO Incur(itemName, dateAcquired, transactionID#) VALUES ('Apples', DATE '2024-10-01', 3);
INSERT INTO Incur(itemName, dateAcquired, transactionID#) VALUES ('Bananas', DATE '2024-09-12', 3);
INSERT INTO Incur(itemName, dateAcquired, transactionID#) VALUES ('Oranges', DATE '2024-08-01', 3);
INSERT INTO Incur(itemName, dateAcquired, transactionID#) VALUES ('Mangoes', DATE '2024-10-01', 3);
INSERT INTO Incur(itemName, dateAcquired, transactionID#) VALUES ('Cherries', DATE '2024-09-12', 3);
INSERT INTO Incur(itemName, dateAcquired, transactionID#) VALUES ('Plums', DATE '2024-08-01', 3);

INSERT INTO UtilityBillProvider(name, serviceProviderPlan) VALUES ('Water Bill', 'BC Hydro');
INSERT INTO UtilityBillProvider(name, serviceProviderPlan) VALUES ('Electricity Bill', 'FortisBC');
INSERT INTO UtilityBillProvider(name, serviceProviderPlan) VALUES ('Gas Bill', 'FortisBC');
INSERT INTO UtilityBillProvider(name, serviceProviderPlan) VALUES ('Family Plan Phone Bill', 'Telus');
INSERT INTO UtilityBillProvider(name, serviceProviderPlan) VALUES ('Joe Phone Bill', 'Rogers');

INSERT INTO UtilityBillCost(name, cost) VALUES ('Water Bill', 120.05);
INSERT INTO UtilityBillCost(name, cost) VALUES ('Electricity Bill', 180.75);
INSERT INTO UtilityBillCost(name, cost) VALUES ('Gas Bill', 87.33);
INSERT INTO UtilityBillCost(name, cost) VALUES ('Family Plan Phone Bill', 160.05);
INSERT INTO UtilityBillCost(name, cost) VALUES ('Joe Phone Bill', 59.61);

INSERT INTO UtilityBill(name, dueDate, transactionID#, periodStartDate, periodEndDate) VALUES ('Water Bill', DATE '2024-11-22', 4, DATE '2024-09-02', DATE '2024-09-29');
INSERT INTO UtilityBill(name, dueDate, transactionID#, periodStartDate, periodEndDate) VALUES ('Electricity Bill', DATE '2024-11-18', 4, DATE '2024-09-01', DATE '2024-10-28');
INSERT INTO UtilityBill(name, dueDate, transactionID#, periodStartDate, periodEndDate) VALUES ('Gas Bill', DATE '2024-11-18', 4, DATE '2024-09-03', DATE '2024-10-31');
INSERT INTO UtilityBill(name, dueDate, transactionID#, periodStartDate, periodEndDate) VALUES ('Family Plan Phone Bill', DATE '2024-11-18', 6, DATE '2024-09-01', DATE '2024-10-28');
INSERT INTO UtilityBill(name, dueDate, transactionID#, periodStartDate, periodEndDate) VALUES ('Joe Phone Bill', DATE '2024-11-05', 7, DATE '2024-09-01', DATE '2024-10-28');

INSERT INTO PossessAccount(accountID#, ownerID#, budget, totalExpenses) VALUES (32, 1, 100500.52, 5000.11);
INSERT INTO PossessAccount(accountID#, ownerID#, budget, totalExpenses) VALUES (31, 2, 200000.70, 0);
INSERT INTO PossessAccount(accountID#, ownerID#, budget, totalExpenses) VALUES (36, 3, 1400000.21, 24.99);
INSERT INTO PossessAccount(accountID#, ownerID#, budget, totalExpenses) VALUES (42, 4, 4546.59, 5);
INSERT INTO PossessAccount(accountID#, ownerID#, budget, totalExpenses) VALUES (1, 5, 50.11, 6000000);
INSERT INTO PossessAccount(accountID#, ownerID#, budget, totalExpenses) VALUES (56, 6, 10000000, 4444);

INSERT INTO ExpenseStatus(paidAmount, splitCost, status) VALUES (12.99, 17.31, 'unpaid');
INSERT INTO ExpenseStatus(paidAmount, splitCost, status) VALUES (1.11, 8.43, 'unpaid');
INSERT INTO ExpenseStatus(paidAmount, splitCost, status) VALUES (0, 9.94, 'unpaid');
INSERT INTO ExpenseStatus(paidAmount, splitCost, status) VALUES (1.20, 64.69, 'unpaid');
INSERT INTO ExpenseStatus(paidAmount, splitCost, status) VALUES (5.47, 5.47, 'paid');
INSERT INTO ExpenseStatus(paidAmount, splitCost, status) VALUES (32.00, 50.00, 'unpaid');
INSERT INTO ExpenseStatus(paidAmount, splitCost, status) VALUES (37.42, 37.42, 'paid');
INSERT INTO ExpenseStatus(paidAmount, splitCost, status) VALUES (16.31, 16.31, 'paid');

INSERT INTO Track(accountID#, transactionID#, paidAmount, splitCost) VALUES (32, 1, 12.99, 17.31);
INSERT INTO Track(accountID#, transactionID#, paidAmount, splitCost) VALUES (32, 2, 1.11, 8.43);
INSERT INTO Track(accountID#, transactionID#, paidAmount, splitCost) VALUES (56, 7, 0, 9.94);
INSERT INTO Track(accountID#, transactionID#, paidAmount, splitCost) VALUES (1, 4, 1.20, 64.69);
INSERT INTO Track(accountID#, transactionID#, paidAmount, splitCost) VALUES (42, 3, 5.47, 5.47);
INSERT INTO Track(accountID#, transactionID#, paidAmount, splitCost) VALUES (32, 10, 32.00, 50.00);
INSERT INTO Track(accountID#, transactionID#, paidAmount, splitCost) VALUES (31, 11, 37.42, 37.42);
INSERT INTO Track(accountID#, transactionID#, paidAmount, splitCost) VALUES (42, 12, 16.31, 16.31);
