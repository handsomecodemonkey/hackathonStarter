const createColony = require('./create_colony');

createColony()
  // We're exiting hard here as the providers keep polling otherwise
  .then(() => process.exit())
  .catch(err => console.error(err));
