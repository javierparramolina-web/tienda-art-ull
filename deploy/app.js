// Shared Hosting Shim
// Many hosts look for app.js or index.js instead of server.js
// This file simply delegates to the real server.js file
require('./server.js');
