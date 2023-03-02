import {View} from 'react-native';
import React from 'react';
import {StripeProvider} from '@stripe/stripe-react-native';
import PaymentScreen from './PaymentScreen';
import {NavigationProp} from '@react-navigation/native';

function Payment({navigation}: {navigation: NavigationProp<any>}) {
  return (
    <StripeProvider publishableKey="pk_test_51MejupB3Jsb0yKWKLl6QBVd44qXq41jGKc6OnDU7sE9td8TBhMI15nBfMdOfHdHSwNzUONFBUeEMHbdEfdwxtNnY00QvdhIoVf">
      <PaymentScreen navigation={navigation} />
    </StripeProvider>
  );
}

export default Payment;
