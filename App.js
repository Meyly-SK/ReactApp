import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login';
import Registro from './Registro';
import RegistroUsuario from './RegistroUsuario';
import Prueba from './Prueba';
import { UsuarioProvider } from './UsuarioContext';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <UsuarioProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Registro" component={Registro} />
          <Stack.Screen name='RegistroUsuario' component={RegistroUsuario}/>
          <Stack.Screen name='Prueba' component={Prueba}/>
        </Stack.Navigator>
      </NavigationContainer>
    </UsuarioProvider>
  );
}

export default App;