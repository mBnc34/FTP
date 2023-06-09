const net = require('net');
// var readline = require('readline');
const os = require('os');
const { handleUserCommand } = require('./data.js');
// require('./commands/INDEX.js');//pour remplir toutes les commandes

const PORT = 21000;
// const HOST = 'localhost'; // a enlever pour ecouter sur d'autres reseau
const networkInterfaces = os.networkInterfaces();
const addresses = [];

for (const interfaceName in networkInterfaces) {
      const interfaces = networkInterfaces[interfaceName];

      for (const iface of interfaces) {
            // the subnet of the school
            if (iface.family === 'IPv4' && !iface.internal && iface.netmask === '255.255.224.0') {
                  addresses.push(iface.address);
            }
      }
}

const HOST = addresses[0];
console.log(`host: ${HOST}`);
// const server = net.createServer();


function startServer() {
      const server = net.createServer();
      let activeConnections = 0;

      server.on('connection', socket => {
            if (activeConnections<2) {
                  var connectionInformation = {
                        user: null,
                        connectionSocket: null,
                        passiveServer: null,
                        dataSocket: null,
                        dataSocketPromise: null,
                        type: 'A',
                        isConnected: false,
                        rootDirectory: "Server/RootDirectory",
                        currentDirectory: "Server/RootDirectory",
                        rnfrPath: ""
                  };
                  connectionInformation.connectionSocket = socket;
            
                  console.log(`Client ${socket.remoteAddress}:${socket.remotePort} connected `);
                  activeConnections ++;
                  socket.write('220 Welcome from the server!\r\n');
                  socket.on('data', (data) => {
                        console.log(`data ${data}`);
                        handleUserCommand(connectionInformation, data);
                  });
            
                  socket.on('error', (error) => {
                        if (error.code === 'ECONNRESET') {
                              connectionInformation.isConnected = false;
                              // console.log("Client disconnected");
                        } else {
                              console.error("An error occurred with the client connection:", error);
                        }
                  });
            
            
                  socket.on('close', () => {
                        activeConnections --;
                        try {
                              connectionInformation.isConnected = false;
                              console.log("client disconnected");
                        } catch (error) {
                              console.error("An error occurred while handling client disconnection:", error);
                        }
                  })
            } else {
                  socket.end('421 Too many connections. Please try again later.\r\n');
            }
            
            
      });
      
      server.listen(PORT, HOST, () => console.log(`Server FTP launched on port ${PORT}`));
            // server.listen(PORT,  () => console.log('Server FTP launched on port 21'));
}

startServer();