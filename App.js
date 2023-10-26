import {StripeProvider, presentPaymentSheet, usePaymentSheet} from '@stripe/stripe-react-native';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import Payment from './components/Payment';
import { useEffect } from 'react';
import { API_URL } from './Constants';

export default function App() {

  const {initPaymentSheet, presentPaymentSheet, loading} = usePaymentSheet();
  
  
  useEffect( () => {
    initializePaymentSheet();
  },[]);

  const initializePaymentSheet = async () => {
    const {paymentIntent, ephemeralKey, customer} = await fetchPaymentParams();
  
    const {error} = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      setupIntentClientSecret: paymentIntent,
      merchantDisplayName: 'Example Inc',
      allowsDelayedPaymentMethods: true,
      returnURL: 'あなたのreturnURL' // 必要に応じて実際のreturnURLに置き換えてください。
    });
  
    if (error) {
      Alert.alert(`エラーコード: ${error.code}`, error.message);
    } else {
      Alert.alert('成功', '支払いが正常に確認されました');
      setReady(true);  // あなたのロジックに応じて、これは setReady(true) である可能性もあります。
    }
  }
  
  const fetchPaymentSheetParams = async () =>{
    const response =await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
      }
    });
    
    const {paymentIntent, ephemeralKey, customer} = await response.json();

    return{
      paymentIntent,
      ephemeralKey,
      customer
    };
  }

  async function buy() {
    const {error} = await presentPaymentSheet();

    if(error){
      Alert.alert(`Error code: ${error.code}`, error.message);
    }else {
      Alert.alert('Success', 'The payment was confirmed successfully');
      setReady(false);
    }
  }
  return (
    <View style={styles.container}>
      <StripeProvider publishableKey="pk_test_51NtO6RLW221JJXozW2oCDu9grbrhG8KLplvCvQ5oOqJgLRDTdvQnPzr7TYVN1RbpxPipUbKKnfKko5kBKnnTvqeQ00KLx9rqfs">
        <Text>1 kg of Sweet Potatoes</Text>
        <Button title={'Buy'} onPress={buy} disabled={loading || !ready } />
      </StripeProvider>
    </View>
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
