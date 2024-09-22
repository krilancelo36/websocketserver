const WebSocket = require('ws');
const mongoose = require('mongoose');

// Cadena de conexión corregida
const MONGODB_URI = 'mongodb://krilancelo2018:daitan33@cluster0-shard-00-00.viq91.mongodb.net:27017,cluster0-shard-00-01.viq91.mongodb.net:27017,cluster0-shard-00-02.viq91.mongodb.net:27017/trips?ssl=true&replicaSet=atlas-12345-shard-0&authSource=admin&retryWrites=true&w=majority';

// Conectar a MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch((error) => console.error('Error conectando a MongoDB:', error));

// Definir un esquema y modelo de datos para los viajes
const tripSchema = new mongoose.Schema({
  message: String,
  timestamp: { type: Date, default: Date.now }
});

const Trip = mongoose.model('Trip', tripSchema);

// Crear el servidor WebSocket
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  // Escuchar mensajes desde el cliente
  ws.on('message', (message) => {
    console.log('Mensaje recibido del cliente:', message);

    // Guardar el mensaje en MongoDB
    const newTrip = new Trip({ message });
    newTrip.save()
      .then(() => console.log('Mensaje guardado en MongoDB'))
      .catch((error) => console.error('Error guardando en MongoDB:', error));
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });

  ws.on('error', (error) => {
    console.error('Error en WebSocket:', error);
  });
});

console.log('Servidor WebSocket escuchando en el puerto 8080');
