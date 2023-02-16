import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationProp} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Button,
  TextInput,
  ToastAndroid,
} from 'react-native';

type Cart = {
  id: string;
  CartItem: {
    id: string;
    product: {
      id: string;
      name: string;
      price: number;
      img: string;
    };
  }[];
};

const Checkout = ({navigation}: {navigation: NavigationProp<any>}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [building, setBuildng] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');
  const [data, setData] = React.useState<Cart | null>(null);
  const [days, setDays] = React.useState(1);
  const [cart, setCart] = React.useState('');

  const getDays = async () => {
    const days = await AsyncStorage.getItem('days');
    if (days) {
      setDays(parseInt(days));
    }
  };

  const getCart = async () => {
    const cart = await AsyncStorage.getItem('cart');
    if (cart) {
      setCart(cart);
      fetch(`http://192.168.1.211:3001/cart/${cart}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            //create cart
            fetch('http://192.168.1.211/3001/cart', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            })
              .then(response => {
                if (response.ok) {
                  return response.json();
                } else {
                  throw response;
                }
              })
              .then(json => AsyncStorage.setItem('cart', json.id));
          }
          throw response;
        })
        .then(json => setData(json))
        .catch(error => console.error(error));
    }
  };
  useEffect(() => {
    getCart();
    getDays();
  }, []);

  return (
    <ScrollView className="bg-gray-500">
      <View className="p-4">
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          className="mb-4 w-full rounded-md border-2 border-gray-300 px-3 py-2 text-base"
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          className="mb-4 w-full rounded-md border-2 border-gray-300 px-3 py-2 text-base"
        />
        <TextInput
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          className="mb-4 w-full rounded-md border-2 border-gray-300 px-3 py-2 text-base"
        />
        <TextInput
          placeholder="Street"
          value={street}
          onChangeText={setStreet}
          className="mb-4 w-full rounded-md border-2 border-gray-300 px-3 py-2 text-base"
        />
        <TextInput
          placeholder="City"
          value={city}
          onChangeText={setCity}
          className="mb-4 w-full rounded-md border-2 border-gray-300 px-3 py-2 text-base"
        />
        <TextInput
          placeholder="Building"
          value={building}
          onChangeText={setBuildng}
          className="mb-4 w-full rounded-md border-2 border-gray-300 px-3 py-2 text-base"
        />
        <TextInput
          placeholder="Zip"
          value={zip}
          onChangeText={setZip}
          className="mb-4 w-full rounded-md border-2 border-gray-300 px-3 py-2 text-base"
        />
        <TextInput
          placeholder="Country"
          value={country}
          onChangeText={setCountry}
          className="mb-4 w-full rounded-md border-2 border-gray-300 px-3 py-2 text-base"
        />
        <Button
          title="Submit"
          onPress={() => {
            console.log(data?.CartItem.map(i => i?.product.id));
            console.log(days);
            console.log(cart);
            fetch('http://192.168.1.211:3001/order', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                customer: '',
                email: email,
                name: name,
                phone: phone,
                status: 'cl9sfz1xz0003tk2se0jt74m6',
                price: data
                  ? data?.CartItem.reduce(
                      (acc, i) => acc + i?.product.price,
                      0,
                    ) * days
                  : 0,

                items: data?.CartItem.map(i => i?.product.id),
                rentDays: days,
                address: street,
                city: city,
                building: building,
                zip: zip,
                country: country,
                cartId: cart,
              }),
            })
              .then(response => {
                if (response.ok) {
                  return response.json();
                } else {
                  if (response.status === 404) {
                    ToastAndroid.show(
                      'Some products are not avaliable',
                      ToastAndroid.TOP,
                    );
                  }
                  throw response;
                }
              })
              .then(json => {
                fetch('http://192.168.1.211:3001/email/send', {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    email: email,
                    template: 'Order Recive',
                    variables: {
                      CLIENT_NAME: name,
                      ORDER_NUMBER: json.number,
                      ORDER_DETAILS: data?.CartItem.map(
                        i => i?.product.name + '<br>',
                      ),
                      ORDER_DATE: json.createdAt.split('T')[0],
                      TOTAL_AMOUNT: json?.price,
                      CONTACT_EMAIL: 'konradqxd@gmail.com',
                    },
                  }),
                });
                navigation.navigate('Home');
              });
          }}
        />
      </View>
    </ScrollView>
  );
};

export default Checkout;
