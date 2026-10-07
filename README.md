# Home Management Application

A web app for managing a shared household: **items** in storage, member **complaints**, **tasks**, and **finances** (bills, accounts, expenses).


## Features

- **People** – add and remove household members
- **Items** – view stored items, find poor-quality items, and items consumed by every member
- **Complaints** – view complaints and count them by severity
- **Tasks** – assign tasks, see available people and per-person task counts
- **Financial** – update utility bill providers and account budgets, view transactions per person

## Tech Stack

- **Frontend:** React 18 (Create React App), in [react-app/](react-app/)
- **Backend:** Node.js + Express, in [server.js](server.js), [appController.js](appController.js) and [appService.js](appService.js)
- **Database:** Oracle (via `oracledb`)

The React build is served by Express from [public/](public/).

## Project Structure

```
server.js            Express entry point (serves public/, mounts API routes)
appController.js     API routes
appService.js        Oracle queries
home_management.sql  DROP / CREATE / INSERT statements for the schema
react-app/           React source
public/              Built frontend (generated)
scripts/             DB tunnel, Oracle client setup and build helpers (mac/win)
Milestones/          Project milestone documents
```

## Setup

### Prerequisites

- Node.js and npm
- Oracle Instant Client (see `scripts/*/instantclient-setup.*`)
- Access to an Oracle database (the scripts assume the UBC CS student server)

### Configure

Create a `.env` file in the project root:

```
ORACLE_USER=
ORACLE_PASS=
ORACLE_HOST=
ORACLE_PORT=
ORACLE_DBNAME=
PORT=
```

`PORT` defaults to 65534 if unset. Load the schema by running [home_management.sql](home_management.sql) against your database.

### Run

```bash
npm install
npm install --prefix react-app
```

Open an SSH tunnel to the database (it updates `.env` for you):

- Windows: `scripts\win\db-tunnel.cmd`
- Mac: `scripts/mac/db-tunnel.sh`

Then start the server:

```bash
node server.js
```

The app is served at `http://localhost:<PORT>/`. On the UBC undergrad server, use `./remote-start.sh` instead, which picks a free port and starts the server.

### Rebuilding the frontend

After changing code in `react-app/`, rebuild into `public/`:

```bash
scripts/mac/build-react.sh
```

For frontend development with hot reload, run `npm start --prefix react-app`.
