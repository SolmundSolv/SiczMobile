import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationProp} from '@react-navigation/native';
import {useStripe} from '@stripe/stripe-react-native';
import {useState, useEffect} from 'react';
import {Alert, Button} from 'react-native';
import {Screen} from 'react-native-screens';

export default function PaymentScreen({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [loading, setLoading] = useState(false);
  const fetchPaymentSheetParams = async () => {
    const cartId = await AsyncStorage.getItem('cart');
    const days = await AsyncStorage.getItem('days');
    console.log(cartId, days);
    const response = await fetch(
      `http://192.168.1.211:3001/stripe/payment-sheet`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartId: cartId,
          days: days,
        }),
      },
    );
    const {paymentIntent, ephemeralKey, customer} = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const {paymentIntent, ephemeralKey, customer} =
      await fetchPaymentSheetParams();

    const {error} = await initPaymentSheet({
      merchantDisplayName: 'Example, Inc.',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      },
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const {error} = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
      navigation.navigate('Home');
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <Screen className="h-full items-center justify-center bg-gray-600">
      <Button disabled={!loading} title="Pay" onPress={openPaymentSheet} />
    </Screen>
  );
}
