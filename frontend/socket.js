// with ES6 import
import io from 'socket.io-client';
let client = null;


const SERVER    = 'http://localhost:4051';

// client = io.connect(SERVER, {path: "/bot/socket.io"});

client = io.connect(SERVER, {});


let events = {};

client.on('connect', function(){
    console.log('Connected');
});

events['message'] = [];
client.on('message', function(data){
    events['message'](data);
});

events['generator'] = [];
client.on('generator', function(data){
    events['generator'](data);
});

client.on('disconnect', function(){
    console.log('Disconnect');
});


function subscribe(event, callback) {
    events[event] = callback;
}


export default {subscribe: subscribe, client: client};