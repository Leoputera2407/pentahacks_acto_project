let io = null;
socketClientMap = new Map(); //maps clientID to socket.

function initSocketIoServer(server){
    io = require('socket.io')(server, {origin: "*" /*TODO: CHANGE ORIGIN FOR PROd */});
    io.use(function (socket, next) {
        const connectionID = socket.handshake.query.connectionID;
        if(socketClientMap.has(connectionID)) {
            if (socketClientMap.get(connectionID) === null) {
                socketClientMap.set(connectionID, socket);
                setInterval(()=>{
                    console.log("emitting loading evt");
                    socket.emit("LOADING_EVT", "hello hello");
                },2000);
            }
            return next();
        }else{
            return next( new Error("Unauthenticated."));
        }

    });
}

module.exports = {
    socketClientMap: socketClientMap,
    initSocketIoServer: initSocketIoServer

}

