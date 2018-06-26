# ABA Hackathon Project

## Prerequisites
You must have `yarn`, `nodejs`, and `npm` installed to use this starter.

This starter needs to run with node version >= 8.2.1 - you may find it helpful to use `nvm` to manage node versions. We recommend using node 9.5. 

## Install
Clone to your working directory of choice with:
```
~$ git clone https://github.com/handsomecodemonkey/hackathonStarter
```

Move to your new starter directory and install dependencies:
```
$ cd hackathonStarter/

~/hackathonStarter$ yarn 
```

## Get Started

This project uses express-js to serve web pages and sqlite as a caching mechanism from the blockchain.
Materialize was used on the front-end.

### Start a test blockchain
In a new terminal window:
```
~/hackathonStarter$ yarn start-ganache
```

### Deploy the colonyNetwork to ganache
```
~/hackathonStarter$ yarn deploy-contracts
```

### Start TrufflePig
In a new terminal window, `cd` to the hackathonStarter and start TrufflePig with
```
~/hackathonStarter$ yarn start-trufflepig
```

### Initialize with mock data
This will create the token, colony, domains (every team has a domain), and a sample task in each domain.
```
~/hackathonStarter$ yarn create-mock-data
```

### Run example code
The code will start an express js server hosting web pages at localhost:3000. Go to http://localhost:3000/home to get to the ABA homepage. Clicking on a team name will bring you to the team's front office and the tasks associated with the team/domain.
```
~/hackathonStarter$ yarn start-server
```
