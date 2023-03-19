module.exports = {
    start: function(io) {
        io.on('connection', (socket) => {
            //Chatbot initialization
            socket.emit("showMainMenu", {menuType: "mainMenu", id: socket.id});
            
            //Place order
            socket.on("placeOrder", (data) => {
                socket.emit("createOrder", {msg: data.msg, menuType: 'mealMenu', id: socket.id});
            });

            //Checkout order or select meal with same option
            socket.on("checkoutOrder", (data) => {
                socket.emit("orderPlaced", {msg: data.msg, menuType: "mainMenu", id: socket.id});
            });

            //See order history or select meal with same option
            socket.on("ordersHistory", (data) => {
                socket.emit("seeOrdersHistory", {msg: data.msg, menuType: "mainMenu", id: socket.id});
            });

            //Current order history or select meal with same option
            socket.on("currentOrder", (data) => {
                socket.emit("seeCurrentOrder", {msg: data.msg, menuType: "mainMenu", id: socket.id});
            });

            //Cancel order history or select meal with same option
            socket.on("cancelOrder", (data) => {
                socket.emit("cancelLasOrder", {msg: data.msg, menuType: "mainMenu", id: socket.id});
            });

            //Invalid option history or select meal with same option
            socket.on("invalidOption", (state) => {

            });
            
            
            socket.on("backToMainMenu", (data) => {
                socket.emit("showMainMenu", {msg: data.msg, menuType: "mainMenu"});
            })
            
            socket.on("orderCreated", (data) => {
                socket.emit("addTocart", {msg: data.msg, menuType: "mainMenu", id: socket.id})
            });           
           
            
            socket.on('disconnect', () => {
                console.log('Client disconnected');
            })
        });
    }
}