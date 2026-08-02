import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import RootStack from './src/navigation/RootStack.js';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/contexts/ThemeContext.js';
import { AuthProvider } from './src/contexts/AuthContext.js';


function App() {

  return (
    <AuthProvider>
    <ThemeProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar barStyle='light-content' />
          <RootStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
