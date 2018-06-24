//Database functions and constants
const CREATE_COLONY_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS colony (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                     name VARCHAR(100), 
                     meta_colony_id integer default 0, 
                     address VARCHAR(50));`;

const CREATE_SKILL_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS skill (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                    name VARCHAR(100));`;

const CREATE_DOMAIN_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS domain (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                                   name VARCHAR(100), 
                                   colony_id integer, 
                                   root_local_skill_id INTEGER,
                                   foreign key(colony_id) references colony(id),
                                   FOREIGN KEY(root_local_skill_id) REFERENCES skill(id));`;

const CREATE_TASK_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS task (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                          title VARCHAR(100), 
                                description VARCHAR(2000),
                          domain_id integer, 
                                foreign key(domain_id) references domain(id))`;

//Function to connect to SQL Lite DB cache
function connectToDB() {
  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database('src/temp.db', (err) => {
    console.log("Connecting to DB...")
    if(err) {
      console.log("problem connecting to db");
      db.close();
      return null;
    } else {
      console.log("succesful connection to db");
    }
  });
  return db;
}

function createTable(db, sql) {
  db.serialize(function() {
    db.run(sql);
  });
}

function insertIntoTable(db,tableName,columns,values) {
  var sql = "INSERT INTO " + tableName + "(";
  sql += (columns.map((column) => column).join(',')) + ") ";
  sql += "VALUES(";
  sql += (values.map((value) => '?').join(',')) + "); ";
    
  db.run(sql,values, function(err) {
    if(err) {
      console.log(err);
    }
  });

}

// Import the prerequisites

const { providers, Wallet } = require('ethers');
const { default: EthersAdapter } = require('@colony/colony-js-adapter-ethers');
const { TrufflepigLoader } = require('@colony/colony-js-contract-loader-http');

// Import the ColonyNetworkClient
const { default: ColonyNetworkClient } = require('@colony/colony-js-client');

// Create an instance of the Trufflepig contract loader
const loader = new TrufflepigLoader();

// Create a provider for local TestRPC (Ganache)
const provider = new providers.JsonRpcProvider('http://localhost:8545/');

const ecp = require('./ecp');


// The following methods use Promises
const example = async () => {

  await ecp.init();

  //Create tables
  var db = connectToDB();
  db.serialize(function() {
    createTable(db, CREATE_COLONY_TABLE_SQL);
    createTable(db, CREATE_SKILL_TABLE_SQL);
    createTable(db, CREATE_DOMAIN_TABLE_SQL);
    createTable(db, CREATE_TASK_TABLE_SQL);
  });

  // Get the private key from the first account from the ganache-accounts
  // through trufflepig
  const { privateKey } = await loader.getAccount(0);

  // Create a wallet with the private key (so we have a balance we can use)
  const wallet = new Wallet(privateKey, provider);

  // Create an adapter (powered by ethers)
  const adapter = new EthersAdapter({
    loader,
    provider,
    wallet,
  });

  // Connect to ColonyNetwork with the adapter!
  const networkClient = new ColonyNetworkClient({ adapter });
  await networkClient.init();

  // 1) Deploy Token
  const tokenAddress = await networkClient.createToken({
    name: 'ABA Token',
    symbol: 'ABA',
  });
  console.log('Token address: ' + tokenAddress);

  // 2) Create Colony
  const {
    eventData: { colonyId, colonyAddress },
  } = await networkClient.createColony.send({ tokenAddress });

  // Congrats, you've created a Colony!
  console.log('Colony ID: ' + colonyId);
  console.log('Colony address: ' + colonyAddress);

  // For a colony that exists already, you just need its ID:
  const colonyClient = await networkClient.getColonyClient(colonyId);
  const baseDomain = await colonyClient.getDomain.call({domainId: 1}); //1 is the first domain

  // You can also get the Meta Colony:
  const metaColonyClient = await networkClient.getMetaColonyClient();
  console.log('Meta Colony address: ' + metaColonyClient.contract.address);

  //Initial Data cache setups
  db.serialize(function() {
    insertIntoTable(db, "COLONY", ["id","name","meta_colony_id","address"], [1,"Meta-Colony",0,metaColonyClient.contract.address]);
    insertIntoTable(db, "COLONY", ["id,name,meta_colony_id,address"],[colonyId,"ABA",1,colonyAddress]);
    insertIntoTable(db,"SKILL", ["id","name"],[1,"Root Globabl Skill"]);
    insertIntoTable(db,"SKILL", ["id","name"],[2,"Local Root Skill for Meta-Colony"]);
    insertIntoTable(db,"SKILL", ["id","name"],[3,"Local Root Skill for ABA Colony"]);
    insertIntoTable(db,"DOMAIN",["id","name","colony_id","root_local_skill_id"],[1,"ABA Root Domain",colonyId,baseDomain.localSkillId]);
  });


  // 3) Create domains (4 for testing one for each team) & Create Tasks
  //TODO put mock data into a json file domains, colony, token, etc.

  for(var i = 0; i < 5; i++) {

    var m = await colonyClient.addDomain.send({parentSkillId : baseDomain.localSkillId});
    var domains = await colonyClient.getDomainCount.call();
    var domainName = "";
    console.log("domain id = " + domains.count);

    switch(domains.count) {
      case 2:
        domainName = "Stags";
        break;
      case 3:
        domainName = "Comets";
        break;
      case 4:
        domainName = "Steers";
        break;
      case 5:
        domainName = "Royals";
        break;
    }

    // Unique, immutable hash on IPFS
    var taskObj1 = {};
    taskObj1.title = "Create Scout Report";
    taskObj1.description = "This is an open task to create a scouting report for the " + domainName + '.';
    var specificationHash = await ecp.saveTaskSpecification(taskObj1);
    //console.log('Specification hash', specificationHash);
    // Create a task in the root domain
    var { eventData: { taskId }} = await colonyClient.createTask.send({ specificationHash, domainId: domains.count});

    //console.log("changing task due date to: " + new Date());
    //await colonyClient.setTaskDueDate.startOperation({ taskId: 1, dueDate: new Date() });

    // Let's take a look at the newly created task
    //var task = await colonyClient.getTask.call({ taskId });
    //console.log(task);

    db.serialize(function() {
          insertIntoTable(db,"DOMAIN",["id","name","colony_id","root_local_skill_id"],[domains.count,domainName,colonyId,baseDomain.localSkillId]);
          insertIntoTable(db,"TASK",["title","description","domain_id"],[taskObj1.title,taskObj1.description,domains.count]);
    });
  }

  // Do some cleanup
  await ecp.stop();
  db.close();

  return colonyClient;
};

module.exports = example;

