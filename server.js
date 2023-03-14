const server = require('./index');
const config = require('./configs/config');



server.listen(config.PORT, () => {
    console.log(`Server is running on port: ${config.PORT}`)
});