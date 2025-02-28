import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';

function App() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('./assets/react-logo.png')} style={styles.logo} />
        <Image source={require('./assets/vite-logo.png')} style={styles.logo} />
      </View>

      <Text style={styles.title}>Vite + React Native</Text>
      
      <View style={styles.card}>
        <Button title={`Count is ${count}`} onPress={() => setCount(count + 1)} />
        <Text style={styles.infoText}>Edit App.jsx and save to test HMR</Text>
      </View>

      <Text style={styles.footerText}>Click on the logos to learn more</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    margin: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    alignItems: 'center',
    marginVertical: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});

export default App;
