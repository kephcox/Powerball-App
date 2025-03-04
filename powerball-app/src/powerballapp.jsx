import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Picker,
  Alert,
} from 'react-native';

export default function PowerballApp() {
  const [generatedNumbers, setGeneratedNumbers] = useState([]);
  const [userNumbers, setUserNumbers] = useState(Array(5).fill(null));
  const [userPowerball, setUserPowerball] = useState(null);

  // Generate unique Powerball numbers
  const generatePowerballNumbers = () => {
    const mainNumbers = generateRandomNumbers();
    const powerball = Math.floor(Math.random() * 26) + 1;
    const combination = `${mainNumbers.join("-")}-${powerball}`;
    setGeneratedNumbers([...generatedNumbers, combination]);
  };

  const generateRandomNumbers = () => {
    const availableNumbers = Array.from({ length: 69 }, (_, i) => i + 1);
    const chosen = [];
    while (chosen.length < 5) {
      const index = Math.floor(Math.random() * availableNumbers.length);
      const num = availableNumbers.splice(index, 1)[0];
      chosen.push(num);
    }
    return chosen;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Powerball Number Generator</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Choose Your Numbers (Optional)</Text>
        <View style={styles.numberRow}>
          {userNumbers.map((value, index) => (
            <Picker
              key={index}
              selectedValue={value}
              style={styles.picker}
              onValueChange={(itemValue) => {
                const newNumbers = [...userNumbers];
                newNumbers[index] = itemValue;
                setUserNumbers(newNumbers);
              }}
            >
              <Picker.Item label="Select" value={null} />
              {Array.from({ length: 69 }, (_, i) => (
                <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
              ))}
            </Picker>
          ))}
        </View>

        <Text style={styles.label}>Choose Powerball</Text>
        <Picker
          selectedValue={userPowerball}
          style={styles.picker}
          onValueChange={(itemValue) => setUserPowerball(itemValue)}
        >
          <Picker.Item label="Select" value={null} />
          {Array.from({ length: 26 }, (_, i) => (
            <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
          ))}
        </Picker>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={generatePowerballNumbers}>
          <Text style={styles.buttonText}>Generate Random Numbers</Text>
        </TouchableOpacity>
      </View>

      {generatedNumbers.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.label}>Generated Numbers:</Text>
          {generatedNumbers.map((num, index) => (
            <Text key={index} style={styles.generatedNumber}>
              {num}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: 100,
    marginHorizontal: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  generatedNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
});