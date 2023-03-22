const chatMessages = document.getElementById('chat-messages');
const sendButton = document.getElementById('send-button');
const messageBox = document.getElementById('message-box');
const chatInterface = document.getElementById('chat-interface');

var menuType = 'mainMenu';
const botName = `<p class="bot-name">9ja FP Chatbot</p>`;
const customers = {};
const cart = {};



const mainMenu = {
    "1": "Place an order",
    "99": "Checkout order",
    "98": "See orders history",
    "97": "See current order",
    "0": "Cancel order"
}


const mealMenu = {
    "100": {desc: 'Amala with gbegiri, ewedu and ogufe', price: 3200},
    "101": {desc: 'Jollof rice with chicken and salad', price: 1900},
    "102": {desc: 'Offada rice and beef', price: 1550},
    "103": {desc: 'Beans, plantain and sauce', price: 1100},
    "104":  {desc: 'Moin-moin', price: 600},
    "105": {desc: 'Yam porridge and fish', price: 900},
}


//Socket connection
const socket = io();




const createMessage = (msgText, msgClass) => {
    const message = document.createElement('div');
    message.classList.add(msgClass, "messages");
    message.innerHTML = msgText;
    return message;
}


const showMainMenu = () => {
    const date = new Date();
    const msg = `
    ${botName}
    <p class="time">${date.getHours()}:${date.getMinutes()}</p><br>
    <p>Hi,</p><br>
    <h4>Select an option to proceed:</h4>
    <ul>
        <li>1. ${mainMenu["1"]}</li>
        <li>99. ${mainMenu["99"]}</li>
        <li>98. ${mainMenu["98"]}</li>
        <li>97. ${mainMenu["97"]}</li>
        <li>0. ${mainMenu["0"]}</li>
    </ul>
    `
    return msg;
}


function printMessages(customerMsgContent, botMsgContent) {
    if (customerMsgContent) {
        //Customer message
        const customerMsg = createMessage(customerMsgContent, "customer-msg");
        chatMessages.append(customerMsg);
    }

    //Bot Reply
    const botMsg = createMessage(botMsgContent, 'bot-msg');
    chatMessages.append(botMsg);
    
    messageBox.value = "";
    messageBox.focus();
}


function scrollToLastMessage() {
    window.scrollTo(0, document.body.scrollHeight);
}




//Show main menu
socket.on("showMainMenu", (data) => {
    //customer and order information
    if (!customers.hasOwnProperty(data.id)) {
        customers[data.id] = [];
    }

    let customerMsgContent;
    if (data.msg) {
        date1 = new Date();
        customerMsgContent = `
        <p>You</p>
        <p class="time">${date1.getHours()}:${date1.getMinutes()}</p><br>
        <p class="customer-reply">${data.msg}</p>
        `
    }

    const mainMenu = showMainMenu();
    printMessages(customerMsgContent, mainMenu);
    scrollToLastMessage();
});

//Create an Order
socket.on("createOrder", (data) => {
    menuType = data.menuType;
    let date1, date2;

    //Cutomer Message
    date1 = new Date();
    const customerMsgContent = `
    <p>You</p>
    <p class="time">${date1.getHours()}:${date1.getMinutes()}</p><br>
    <p class="customer-reply">${data.msg}</p>
    `

    //Chatbot message
    date2 = new Date();
    const botMsgContent = 
    `
    ${botName}
    <p class="time">${date2.getHours()}:${date2.getMinutes()}</p><br>
    <h4>Place an order:</h4>
    <ul>
        <li>100. ${mealMenu["100"].desc}: <i class='fa-solid fa-naira-sign'></i>${mealMenu["100"].price}</li>
        <li>101. ${mealMenu["101"].desc} - ${mealMenu["101"].price}</li>
        <li>102. ${mealMenu["102"].desc} - ${mealMenu["102"].price}</li>
        <li>103. ${mealMenu["103"].desc} - ${mealMenu["103"].price}</li>
        <li>104. ${mealMenu["104"].desc} - ${mealMenu["104"].price}</li>
        <li>00. Back to Main Menu</li>
    </ul>
    `
    printMessages(customerMsgContent, botMsgContent);
    scrollToLastMessage();
});

//Add order to cart
socket.on("addTocart", (data) => {
    menuType = data.menuType;
    cart[data.id] = data.msg;
    let date1, date2;

    //Cutomer Message
    date1 = new Date();
    const customerMsgContent = `
    <p>You</p>
    <p class="time">${date1.getHours()}:${date1.getMinutes()}</p><br>
    <p class="customer-reply">${data.msg}</p>
    `

    //Chatbot message
    date2 = new Date()
    const botMsgContent = 
    `
    ${botName}
    <p class="time">${date2.getHours()}:${date2.getMinutes()}</p><br>
    <p>Order has been added to cart</p><br>
    <br>
    <ul class="options">
        <li>99. Checkout order</li>
        <li>00. Back to Main Menu</li>
    </ul>
    `
    printMessages(customerMsgContent, botMsgContent)   ;
    scrollToLastMessage();
});


//Checkout order
socket.on("orderPlaced", (data) => {
    menuType = data.menuType;
    let customerMsgContent;
    let botMsgContent;
    let orderID;
    if (cart.hasOwnProperty(data.id)) {
        orderID = cart[data.id];
        delete cart[data.id];
    }

    customers[data.id].push(mealMenu[orderID]); //Save order;
    let date1, date2;

    //Cutomer Message
    date1 = new Date();
    customerMsgContent = `
    <p>You</p>
    <p class="time">${date1.getHours()}:${date1.getMinutes()}</p><br>
    <p class="customer-reply">${data.msg}</p>
    `

    if (!orderID) {
        date2 = new Date();
        botMsgContent = 
        `
        ${botName}
        <p class="time">${date2.getHours()}:${date2.getMinutes()}</p><br>
        <p>Your cart is empty</p><br>
        <ul class="options">
            <li>00. Back to Main Menu</li>
        </ul>
        `
    } else {

        //Chatbot message
        date2 = new Date();
        botMsgContent = 
        `
        ${botName}
        <p class="time">${date2.getHours()}:${date2.getMinutes()}</p><br>
        <p>Your order is being processed...</p><br>
        <h4>Order Details:</h4>
        <p>Description: ${mealMenu[orderID].desc}</p>
        <p>Price: ${mealMenu[orderID].price}</p><br>
        <br>
        <ul class="options">
            <li>00. Back to Main Menu</li>
        </ul>
        `
    }
    printMessages(customerMsgContent, botMsgContent);
    scrollToLastMessage();
})

//See orders history
socket.on("seeOrdersHistory", (data) => {
    menuType = data.menuType;
    let orderHistoryText;
    const orders = customers[data.id];
    if (orders == undefined || orders.length < 1) {
        orderHistoryText = `
        <p>Your order history is currently empty.</p><br>
        `
    } else {
        let allOrders = '';

        for (const order of orders) {
            let orderText = `<p>- ${order.desc}: ${order.price}</p>`
            allOrders += orderText;
        }
        orderHistoryText = allOrders;
    }
    
    let date1, date2;

    //Cutomer Message
    date1 = new Date();
    const customerMsgContent = `
    <p class="customer-name">You</p>
    <p class="time">${date1.getHours()}:${date1.getMinutes()}</p><br>
    <p class="customer-reply">${data.msg}</p>
    `
   
    //Chatbot message
    date2 = new Date();
    const botMsgContent = 
    `
    ${botName}
    <p class="time">${date2.getHours()}:${date2.getMinutes()}</p><br>
    <h4>Orders history:</h4>
    ${orderHistoryText}
    <br>
    <ul class="options">
        <li>00. Back to Main Menu</li>
    </ul>
    `
    printMessages(customerMsgContent, botMsgContent);
    scrollToLastMessage();
})


//See current order
socket.on("seeCurrentOrder", (data) => {
    menuType = data.menuType;
    const orders = customers[data.id];
    let currentOrder;
    let currentOrderText;

    if (orders.length < 1) {
        currentOrderText = `<p>Your order history is currently empty</p>`
    } else if (orders.length >= 1) {
        currentOrder = orders[orders.length - 1];
        currentOrderText = `<p>- ${currentOrder.desc}: ${currentOrder.price}</p>`
    }
    
    let date1, date2;

    //Cutomer Message
    date1 = new Date();
    const customerMsgContent = `
    <p class="customer-name">You</p>
    <p class="time">${date1.getHours()}:${date1.getMinutes()}</p><br>
    <p class="customer-reply">${data.msg}</p>
    ` 

    //Chatbot message
    date2 = new Date();
    const botMsgContent = 
    `
    ${botName}
    <p class="time">${date2.getHours()}:${date2.getMinutes()}</p><br>
    <h4>Current order:</h4>
    ${currentOrderText}
    <br>
    <ul class="options">
        <li>00. Back to Main Menu</li>
    </ul>
    `
    printMessages(customerMsgContent, botMsgContent);
    scrollToLastMessage();
})

//Cancel order
//See current order
socket.on("cancelLasOrder", (data) => {
    menuType = data.menuType;
    const orders = customers[data.id];
    let lastOrder;
    let canceledOrderText;

    if (orders.length < 1) {
        canceledOrderText = `<p>Your order history is currently empty</p>`
    } else if (orders.length >= 1) {
        lastOrder = orders[orders.length - 1];
        canceledOrderText = `
        <p>Order canceled successfully</p>
        <h4>Order details:</h4>
        <p>${lastOrder.desc}: ${lastOrder.price}</p>
        `
        customers[data.id].pop(lastOrder);
    }
    
    let date1, date2;

    //Cutomer Message
    date1 = new Date();
    const customerMsgContent = `
    <p class="customer-name">You</p>
    <p class="time">${date1.getHours()}:${date1.getMinutes()}</p><br>
    <p class="customer-reply">${data.msg}</p>
    ` 

    //Chatbot message
    date2 = new Date()
    const botMsgContent = 
    `
    ${botName}
    <p class="time">${date2.getHours()}:${date2.getMinutes()}</p><br>
    ${canceledOrderText}
    <br>
    <ul class="options">
        <li>00. Back to Main Menu</li>
    </ul>
    `
    printMessages(customerMsgContent, botMsgContent);
    scrollToLastMessage();
})



//Handle Customer replies
sendButton.addEventListener("click", (e) => {
    e.preventDefault();
    const msg = messageBox.value;
    let option;
    switch(msg) {
        case "1":
            option = "placeOrder";
            break;
        case "99":
            option = "checkoutOrder";
            break;
        case "98":
            option = "ordersHistory";
            break;
        case "97":
            option = "currentOrder";
            break;
        case "0":
            option = "cancelOrder";
            break;
        case "00":
            option = "backToMainMenu";
            menuType = "mainMenu"
            break;
        default:
            option = "invalidOption";
    }
    const data = {
        msg,
        menuType
    }

    if (menuType == 'mainMenu') {
        socket.emit(option, data);
    } else if (menuType == 'mealMenu') {
        socket.emit("orderCreated", data)
    }
});


