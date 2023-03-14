require('dotenv').config();


const prod = {
    PORT: process.env.PORT || 3000,
}


module.exports = prod;