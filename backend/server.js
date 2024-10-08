// DEPENDENCIES
const app = require("./app.js");
const dotenv = require('dotenv');

// CONFIGURATION
dotenv.config();
console.log('PORT from env:', process.env.PORT);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

console.log('Final PORT value:', PORT);
console.log('HOST value:', HOST);

// LISTEN
app.listen(PORT, HOST, (err) => {
    if (err) {
        console.error('Error starting server:', err);
        return;
    }
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
