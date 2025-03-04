import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

// ✅ Correct import path for historical Powerball data
import powerballData from '../public/data/powerball.json';

export default function PowerballApp() {
  const [excludedCombinations, setExcludedCombinations] = useState(new Set());
  const [generatedNumbers, setGeneratedNumbers] = useState([]);
  const [userNumbers, setUserNumbers] = useState(Array(5).fill(''));
  const [userPowerball, setUserPowerball] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (!Array.isArray(powerballData)) throw new Error("Invalid data format");

      const historicalCombinations = new Set();
      powerballData.forEach(draw => {
        if (!draw.winning_numbers) return;
        const [mainNumbers, powerball] = draw.winning_numbers.split(" ");
        const mainArray = mainNumbers.split("-").map(num => parseInt(num, 10));
        const powerballNum = parseInt(powerball, 10);
        if (mainArray.some(isNaN) || isNaN(powerballNum)) return;

        mainArray.sort((a, b) => a - b);
        const combination = `${mainArray.join("-")}-${powerballNum}`;
        historicalCombinations.add(combination);
      });

      setExcludedCombinations(historicalCombinations);
    } catch (error) {
      console.error("Failed to load historical numbers:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const generatePowerballNumbers = () => {
    let combination;
    do {
      const mainNumbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 69) + 1);
      const powerball = Math.floor(Math.random() * 26) + 1;

      mainNumbers.sort((a, b) => a - b);
      combination = `${mainNumbers.join("-")}-${powerball}`;
    } while (excludedCombinations.has(combination));

    setGeneratedNumbers([...generatedNumbers, combination]);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Powerball Number Generator</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <>
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Choose Your Numbers:</Text>
              <View style={styles.numberRow}>
                {userNumbers.map((value, index) => (
                  <View key={index} style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={userNumbers[index]}
                      style={styles.picker}
                      onValueChange={(itemValue) => {
                        const newUserNumbers = [...userNumbers];
                        newUserNumbers[index] = itemValue;
                        setUserNumbers(newUserNumbers);
                      }}
                    >
                      <Picker.Item label="Select" value="" />
                      {Array.from({ length: 69 }, (_, i) => (
                        <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
                      ))}
                    </Picker>
                  </View>
                ))}
              </View>

              <Text style={styles.label}>Choose Powerball:</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={userPowerball}
                  style={styles.picker}
                  onValueChange={(itemValue) => setUserPowerball(itemValue)}
                >
                  <Picker.Item label="Select" value="" />
                  {Array.from({ length: 26 }, (_, i) => (
                    <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
                  ))}
                </Picker>
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={generatePowerballNumbers}>
              <Text style={styles.buttonText}>Generate Numbers</Text>
            </TouchableOpacity>

            {generatedNumbers.length > 0 && (
              <View style={styles.resultsContainer}>
                <Text style={styles.label}>Generated Numbers:</Text>
                <FlatList
                  data={generatedNumbers}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => <Text style={styles.generatedNumber}>{item}</Text>}
                />
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  pickerContainer: {
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  numberRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pickerWrapper: {
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    padding: 5,
  },
  picker: {
    height: 50,
    width: 120,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#444',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultsContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  generatedNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
    marginVertical: 5,
  },
});