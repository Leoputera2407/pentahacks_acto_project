let io = null;
let map = {};
let socketClientMap = { has : (k)=>map.hasOwnProperty(k), get : (k)=>map[k], set: (k,v)=>{map[k] = v;} }//new Map(); //maps clientID to socket.

function initSocketIoServer(server){
    io = require('socket.io')(server, {origin: "*" /*TODO: CHANGE ORIGIN FOR PROd */});
    io.use(function (socket, next) {
        const connectionID = socket.handshake.query.connectionID;
        if(socketClientMap.has(connectionID)) {
            return next();
        }else{
            return next( new Error("Unauthenticated."));
        }

    });
    io.on('connection',(socket)=>{
        const connectionID = socket.handshake.query.connectionID;
            if (socketClientMap.get(connectionID) === null) {
                console.log("Setting connection id.");
                socketClientMap.set(connectionID, socket.id);
                console.log("socket: map is now : ",map);
                const id = socket.id;
                io.sockets.connected[id].emit("LOADING_EVT","hehehe");
            }

    })
}

const emitEvt= (connectionID, event, payload)=>{
    const socketid = map[connectionID];
    if (!socketid){
        console.log(event, " ",connectionID, ": SOCKET ID NOT DEFINED.");
    }else{
        io.sockets.connected[socketid].emit(event,payload);
    }

}

exports.initSocketIoServer =initSocketIoServer;
exports.socketClientMap = socketClientMap;
exports.map = map;
exports.emitEvent = emitEvt

