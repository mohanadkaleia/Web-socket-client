/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var url = document.getElementById("url");
var msg = document.getElementById("message");
var log = document.getElementById("log");
var resendTimer = document.getElementById("resend");
var socket = null;
var connected = false;

url.addEventListener('keypress', function (evt) {
    if (evt.charCode !== 13)
        return;
    evt.preventDefault();

    if (url.value === "")
        return;
    // Open the connection
    if(!connected) {
        openSocket();
    }
    
});

var onOpen = function () {
    connected = true;
    //$('.sf-flash').sfFlash();    
    //$('body').append('<div class="sf-flash">Connection has been opened</div>');    
    $("#connectBtn").hide();
    $("#disconnectBtn").show();        
    console.log('Connection is opened ' + url.value);     
};

var onClose = function () {    
    connected = false;
    $("#connectBtn").show();
    $("#disconnectBtn").hide();          
    //$('.sf-flash').sfFlash();    
    //$('body').append('<div class="sf-flash">Connection has been closed.</div>');    
    console.log('CLOSED: ' + url.value);  
};

var onMessage = function (event) {
    var data = event.data;    
    $("#log").html($("#log").html() + "<br/>" + data);
    console.log(data);
};

var onError = function (event) {
    // Hide the status messages 
    connected = false;
    $("#connectBtn").show();
    $("#disconnectBtn").hide();
    console.log('Error: ' + event.data);
    $('.sf-flash').sfFlash();    
    $('body').append('<div class="sf-flash">Error happened!</div>');    
};

var openSocket = function () {    
    socket = new WebSocket(url.value);
    socket.onopen = onOpen;
    socket.onclose = onClose;
    socket.onmessage = onMessage;
    socket.onerror = onError;
};

var closeSocket = function () {    
    if (socket) {
        console.log('CLOSING ...');
        socket.close();
    }
    connected = false;
};

var sendMessage = function() {
    socket.send(msg.value);            
};

function keepSendingMessages() {
    if (resendTimer.value !== '' && resendTimer.value > 0) {
        setInterval(function(){sendMessage();},resendTimer.value * 1000);
    }    
}

$( "#connectBtn" ).click(function() {
    openSocket();
});

$( "#disconnectBtn" ).click(function() {
    closeSocket();
});

$("#send").click(function(){
    sendMessage();
    keepSendingMessages();
});