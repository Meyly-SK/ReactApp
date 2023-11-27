import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { insertarUsuario } from './Database'; 
import { useNavigation } from '@react-navigation/native';

const RegistroUsuario = ({ route }) => {
  const { dni, nombre, apellido } = route.params;
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigation = useNavigation();

  const handleRegistrar = () => {
    insertarUsuario(usuario, nombre, apellido, dni, contrasena)
      .then(() => {
        console.log('Usuario registrado correctamente');
        Alert.alert('Exito','Usuario registrado exitosamente');
        navigation.navigate('Login');
      })
      .catch((error) => {
        Alert.alert('Error','Error al registrar usuario');
        console.error('Error al registrar usuario:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>
      <Text>DNI: {dni}</Text>
      <Text>Nombre: {nombre}</Text>
      <Text>Apellido: {apellido}</Text>
      
      <Text style={styles.label}>Usuario</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese el nombre de usuario"
        value={usuario}
        onChangeText={(text) => setUsuario(text)}
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese la contraseña"
        secureTextEntry
        value={contrasena}
        onChangeText={(text) => setContrasena(text)}
      />

      <Button title="Registrarse" onPress={handleRegistrar} />
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
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
});

export default RegistroUsuario;