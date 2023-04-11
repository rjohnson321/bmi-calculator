import { useEffect, useState } from 'react';
import { 
  Pressable, 
  SafeAreaView,
  ScrollView, 
  StyleSheet, 
  Text, 
  View,
  TextInput
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

const heightKey = 'BMICalculator::height'
const weightKey = 'BMICalculator::weight'

export default function App() {
  const [height, setHeight] = useState(0); // no div by zero
  const [weight, setWeight] = useState(0);
  const [showBMI, setShowBMI] = useState(false);

  useEffect(() => {
    const asyncEffect = async () => {
      const storedHeight = await AsyncStorage.getItem(heightKey);
      const storedWeight = await AsyncStorage.getItem(weightKey);

      if (storedHeight != null) {
        setHeight(parseInt(storedHeight));
        setWeight(parseInt(storedWeight));

        setShowBMI(true);
      }
    };
    asyncEffect();
  }, [])

  const computeBMI = async () => {
    setShowBMI(true);
    await AsyncStorage.setItem(heightKey, height.toString());
    await AsyncStorage.setItem(weightKey, weight.toString());
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.toolbar}>BMI Calculator</Text>
      <ScrollView style={styles.content}>
        <TextInput 
          style={styles.input} 
          placeholder={'Weight in Pounds'} 
          onChangeText={text => setWeight(parseInt(text))}>
        </TextInput>
        <TextInput 
          style={styles.input} 
          placeholder={'Height in Inches'} 
          onChangeText={text => setHeight(parseInt(text))}
          defaultValue={height.toString()}>
        </TextInput>
        <Pressable style={styles.button} onPress={computeBMI}><Text style={styles.buttonText}>Compute BMI</Text></Pressable>
        { showBMI 
          ? <Text style={styles.result}>Body Mass Index is {((weight / (height * height)) * 703).toFixed(1)}</Text>
          : <Text style={styles.result}/>
        }
        <Text style={styles.guideTitle}>Assessing Your BMI</Text>
        <Text style={styles.guideText}>
          Underweight: less than 18.5{'\n'}
          Healthy: 18.5 to 24.9{'\n'}
          Overweight: 25.0 to 29.9{'\n'}
          Obese: 30.0 or higher
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  toolbar: {
    backgroundColor: '#f4511e',
    color: '#fff',
    textAlign: 'center',
    padding: 25,
    fontSize: 28,
    fontWeight: 'bold'
  },
  content: {
    flex: 1,
    padding: 10,
  },
  preview: {
    backgroundColor: '#bdc3c7',
    flex: 1,
    height: 500,
  },
  input: {
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    height: 40,
    padding: 5,
    marginBottom: 10,
    flex: 1,
    fontSize: 24,
  },
  button: {
    backgroundColor: '#34495e',
    padding: 10,
    borderRadius: 3,
    marginBottom: 40,
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 24,
    color: 'white'
  },
  guideTitle: {
    fontSize: 20
  },
  guideText: {
    fontSize: 20,
    marginLeft: 20
  },
  result: {
    alignSelf: 'center',
    fontSize: 28,
    marginBottom: 75
  }
});