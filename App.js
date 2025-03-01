import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Wellcome from './src/Screen/Wellcome'
import Bottomtabs from './src/Navigation/Bottomtabs'
import Movide from './src/Screen/Movide'
import Showtime from './src/Screen/Showtime'
import BockTicket from './src/Screen/BockTicket'
import HoaDonChiTet from './src/Screen/HoaDonChiTet'
import Login from './src/Screen/Login'
import Sigup from './src/Screen/Sigup'
import { Provider } from 'react-redux';
import store from './src/redux/store/index'
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Wellcome' component={Wellcome} />
        <Stack.Screen name='Bottomtabs' component={Bottomtabs} />
        <Stack.Screen name='Movide' component={Movide} />
        <Stack.Screen name='Showtime' component={Showtime} />
        <Stack.Screen name='BockTicket' component={BockTicket} />
        <Stack.Screen name='HoaDonChiTet' component={HoaDonChiTet} />
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='Sigup' component={Sigup} />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
