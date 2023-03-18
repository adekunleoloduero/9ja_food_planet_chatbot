module.exports = {
    start: function(io) {
        io.on('connection', (socket) => {
            //Chatbot initialization
            socket.emit("showMainMenu", "mainMenu");
            
            //Place order
            socket.on("placeOrder", (data) => {
                socket.emit("createOrder", {msg: data.msg, menuType: 'mealMenu'});
            });

            //Checkout order or select meal with same option
            socket.on("checkoutOrder", (data) => {
                socket.emit("orderPlaced", {msg: data.msg, menuType: "mainMenu"});
            });

            //See order history or select meal with same option
            socket.on("ordersHistory", (state) => {
                socket.emit("seeOrdersHistory", {msg: data.msg, menuType: "mainMenu"});
            });

            //Current order history or select meal with same option
            socket.on("currentOrder", (state) => {

            });

            //Cancel order history or select meal with same option
            socket.on("cancelOrder", (state) => {

            });

            //Invalid option history or select meal with same option
            socket.on("invalidOption", (state) => {

            });
            
            
            socket.on("backToMainMenu", (data) => {
                socket.emit("showMainMenu", {msg: data.msg, menuType: "mainMenu"});
            })
            
            socket.on("orderCreated", (data) => {
                socket.emit("addTocart", {msg: data.msg, menuType: "mainMenu"})
            });           
           
            
            socket.on('disconnect', () => {
                console.log('Client disconnected');
            })
        });
    }
}