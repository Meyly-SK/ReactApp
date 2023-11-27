import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet,Alert } from 'react-native';
import {  verificarCredenciales } from './Database';

const Login = ({ navigation }) => {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState(''); 

  const handleIniciarSesion = async () => {
  try {
    const usuarioValido = await verificarCredenciales(usuario, contraseña);

    if (usuarioValido) {
      navigation.navigate('Prueba');
    } else {
      console.log('Usuario o contraseña incorrectos');
      Alert.alert('Error', 'Usuario o contraseña incorrectos');
    }
  } catch (error) {
      Alert.alert('Error', 'Error al iniciar sesion');
    console.error('Error al iniciar sesión:', error);
  }
  };
  
  const handleRegistrarse = () => {
    navigation.navigate('Registro');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        onChangeText={(text) => setUsuario(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        onChangeText={(text) => setContraseña(text)}
      />
      <Button title="Ingresar" onPress={handleIniciarSesion} />
      <TouchableOpacity onPress={handleRegistrarse}>
        <Text style={styles.link}>Registrarse</Text>
      </TouchableOpacity>
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
  link: {
    marginTop: 20,
    color: 'blue',
  },
});

export default Login;