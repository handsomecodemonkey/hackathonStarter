# ABA Hackathon Project

## Prerequisites
You must have `yarn`, `nodejs`, and `npm` installed to use this starter.

This starter needs to run with node version >= 8.2.1 - you may find it helpful to use `nvm` to manage node versions. We recommend using node 9.5. 

## Install
Clone to your working directory of choice with:
```
~$ https://github.com/handsomecodemonkey/hackathonStarter
```

Move to your new starter directory and install dependencies:
```
$ cd hackathonStarter/

~/hackathonStarter$ yarn 
```

## Get Started

This project uses express-js to serve web pages and sqlite as a caching mechanism from the blockchain. Materialize was used on the front-end.

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
```
~/hackathonStarter$ yarn create-mock-data
```

### Run example code
The code example included in this starter will use colonyJS to create a new token, a new colony, and return the address of the Meta Colony on your running test blockchain.
```
~/hackathonStarter$ yarn start-server
```
