import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Registro = () => {
  const [dni, setDni] = useState('');
  const [dniInfo, setDniInfo] = useState(null);
  const navigation = useNavigation();

  const handleBuscarDNI = async () => {
    try {
      const response = await axios.get(`https://api.apis.net.pe/v2/reniec/dni?numero=${dni}`, {
        headers: {
          'Authorization': 'Bearer apis-token-6209.ps7vv2d8fLzbYi8ozkbSDK4lzHw0zj-b',
        },
      });
  
      setDniInfo(response.data);
  
      navigation.push('RegistroUsuario', {
        dni: dni,
        nombre: response.data.nombres,
        apellido: `${response.data.apellidoPaterno} ${response.data.apellidoMaterno}`,
      });
    } catch (error) {
      console.error('Error al buscar información por DNI:', error);
      Alert.alert('Error', 'Error al buscar el dni');
      setDniInfo(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Información por DNI</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese el número de DNI"
        keyboardType="numeric"
        value={dni}
        onChangeText={(text) => setDni(text)}
      />
      <Button title="Buscar" onPress={handleBuscarDNI} />
      {dniInfo && (
        <View style={styles.resultContainer}>
          <Text>Nombre: {dniInfo.nombres}</Text>
          <Text>Apellido Paterno: {dniInfo.apellidoPaterno}</Text>
          <Text>Apellido Materno: {dniInfo.apellidoMaterno}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: 300,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: '#999',
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default Registro;