class Chat {
    constructor( socket ){
        this.socket = socket;
    }
    sendMsg = ( room, text ) => {
        this.socket.emit( 'message', {
            room:room,
            text:text
        } )
    }
}

let socket = io.connect();
let my_chat = new Chat( socket );
//some methods to make sure that text is secured

( () => {

    socket.on( 'rooms', ( message ) => {
        console.log(message);
    } )
    
    /*setInterval( function(){
        socket.emit( 'rooms' );
    }, 5000 )*/ 
    
    socket.on( 'message', ( message ) => {
        let newMsg = document.createElement('div').innerHTML = message.text;
        let msg_box = document.getElementById('Room_MSG')
        msg_box.append( newMsg )
        msg_box.append(document.createElement('br'));

    } )
    
    socket.on( 'joinResult', ( message ) => {
        console.log(message);
    } )

    document.getElementById('Send_MSG').addEventListener( 'click', () => {
        my_chat.sendMsg( 'Lobby', document.getElementById('MSG').value );
        document.getElementById('MSG').value = '';
    } )

} )();

