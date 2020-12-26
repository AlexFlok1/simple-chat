let guestNumber = 1, nickNames = {}, namesUsed = [], currentRooms = {}

let listenChat = ( server ) => {

    let io = require('socket.io')( server );

    io.sockets.on( 'connection', ( socket ) => {
        
        guestNumber = assignGuestName( socket, guestNumber, nickNames, namesUsed );
        joinRoom( socket, 'Lobby' );

        broadCastMessage( socket, nickNames );
        //changeAttempts( socket, nickNames, namesUsed );
        //roomJoining( socket );

        socket.on( 'rooms', () => {
            socket.emit( 'rooms', socket.rooms );
        } )

        user_Disconnect( socket );

    } )
}

let assignGuestName = ( socket, guestNumber, nickNames, namesUsed ) => {

    let name = 'Guest'+guestNumber;
    nickNames[socket.id] = name;
    socket.emit( 'nameResult', {
        success: true,
        name: name
    } )

    namesUsed.push( name );
    return guestNumber + 1

}

let joinRoom = ( socket, room ) => {
    socket.join( room );
    currentRooms[socket.id] = room;
    socket.emit( 'joinResult', {
        room:room
    } );
    console.log(nickNames);
    socket.broadcast.to( room ).emit( 'message', {
        text: 'User ' + nickNames[socket.id] + ' has joined ' + room + '.'
    })

}

let broadCastMessage = ( socket, nickNames ) => {

    socket.on( 'message', ( message ) => {
        socket.broadcast.to( message.room ).emit( 'message',{
            text: nickNames[socket.id] + ': ' + message.text
        } )
        socket.emit( 'message',{
            text: nickNames[socket.id] + ': ' + message.text
        } )
    } )

}

let user_Disconnect = ( socket ) => {
    socket.on( 'disconnect', () => {
        let index = namesUsed.indexOf( nickNames[socket.id] );

        socket.broadcast.to( "Lobby" ).emit( 'message', {
            text: 'User ' + nickNames[socket.id] + ' has disconnected from Lobby .'
        } )

        delete namesUsed[index];
        delete nickNames[socket.id];
    } )
}

exports.listenChat = listenChat;