import { View, Text, TextInput, Button, Alert } from 'react-native'
import React, {useState} from 'react'
import { useStripe } from '@stripe/stripe-react-native';

const Payment = () => {
  const [name, setName] = useState('');
  const stripe = useStripe();

  const subscribe = async () => {
    try {
      const response = await fetch('http://localhost:8080/pay',{
        method: 'POST',
        body: JSON.stringify({name}),
        headers: {
            "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      if(!response.ok) return Alert.alert(data.message);
      const clientSecret = data.clientSecret;
      const initSheet = await stripe.initPaymentSheet({
        intentConfiguration:{
          paymentIntentClientSecret: clientSecret,
        },
      });
      if(initSheet.error) return Alert.alert(initSheet.error.message);
      const presentSheet = await stripe.presentPaymentSheet({
        clientSecret,
      })
      if(presentSheet.error) return Alert.alert(presentSheet.error.message);
      Alert.alert("Payment complete, thank you!")
    } catch (error) {
        console.error(error);
        Alert.alert("something went wrong, try again later!")
    }
  }

  return (
    <View>
      <TextInput 
        value={name} 
        onChangeText={ text => setName(text)}
        placeholder="Name"
        style={{
            width: 300,
            fontSize: 20,
            padding: 10,
            borderWidth: 1,
        }}
      />
      <Button title="Subscribe - 25 INR" onPress={subscribe} /> 
    </View>
  )
}

export default Payment