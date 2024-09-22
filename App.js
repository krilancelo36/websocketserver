// Servidor/App.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const App = () => {
  const [ws, setWs] = useState(null);
  const [receivedMessages, setReceivedMessages] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('ws://https://websocket-server-pqor.onrender.com'); // Cambia TU_IP_LOCAL por la IP de tu red.

    setWs(socket);

    socket.onopen = () => {
      console.log('Conexión WebSocket establecida en el servidor');
    };

    socket.onmessage = (event) => {
      let receivedData;

      if (event.data instanceof ArrayBuffer) {
        const decoder = new TextDecoder('utf-8');
        receivedData = decoder.decode(event.data);
      } else {
        receivedData = event.data;
      }

      console.log('Mensaje recibido del cliente:', receivedData);
      setReceivedMessages((prevMessages) => [...prevMessages, receivedData]);
    };

    socket.onerror = (error) => {
      console.error('Error en WebSocket:', error.message);
    };

    socket.onclose = () => {
      console.log('Conexión WebSocket cerrada');
    };

    // Limpiar cuando se cierre el componente
    return () => {
      socket.close();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Servidor: Mostrar Mensajes Recibidos</Text>
      <ScrollView style={styles.messagesContainer}>
        {receivedMessages.length > 0 ? (
          receivedMessages.map((msg, index) => (
            <Text key={index} style={styles.message}>{msg}</Text>
          ))
        ) : (
          <Text style={styles.noMessages}>No hay mensajes recibidos aún</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  messagesContainer: {
    width: '100%',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    maxHeight: '70%',
  },
  message: {
    fontSize: 16,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  noMessages: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#888',
  },
});

export default App;
