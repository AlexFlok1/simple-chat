let http = require('http');
let fs = require('fs');
let path = require('path');
let mime = require('mime');
let cache = {};

let chatServer = require('./chat-backend');


let send404 = ( response ) => {

    response.writeHead( 404, { 'Content-Type': 'text/plain' } );
    response.write( 'Error 404: resourse not found.' );
    response.end();

}

let sendFile = ( response, filepath, filecontent ) => {
    response.writeHead( 
        200, 
        { 'Content-Type': mime.getType( path.basename( filepath ) ) } 
    );
    response.end( filecontent );
}

let serveStatic = ( response, cache, absPath ) => {

    if( cache[absPath] ){
        sendFile( response, absPath, cache[absPath] )
    }
    else{
        fs.exists( absPath, ( exists ) => {
            if( exists ){
                fs.readFile( absPath,  ( err, data ) => {
                    if( err ){
                        send404( response );
                    }
                    else{
                        cache[absPath] = data;
                        sendFile( response, absPath, data );
                    }
                } )  
            }
            else{
                send404( response );
            }
        } )
    }

}

let server = http.createServer( ( request, resposne ) => {
    let filePath = false;
    
    if( request.url == '/' ){
        filePath = 'public/index.html'
    }
    else{
        filePath = 'public/' + request.url
    }
 
    let absPath = './' + filePath;
    serveStatic( resposne, cache, absPath )

} )

server.listen( 3000, () => {
    console.log('Server is up on 3000 Port');
} )
chatServer.listenChat(server);
