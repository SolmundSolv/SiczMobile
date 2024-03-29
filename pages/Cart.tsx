import React, {useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Button,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Menubar from './components/Menubar';
import {NavigationProp} from '@react-navigation/native';

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

const Cart = ({navigation}: {navigation: NavigationProp<any>}) => {
  const [data, setData] = React.useState<Cart | null>(null);
  const [days, setDays] = React.useState(1);
  const [cartId, setCartId] = React.useState<string | null>(null);

  const getCart = async () => {
    const cart = await AsyncStorage.getItem('cart');
    if (cart) {
      setCartId(cart);
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
  }, []);
  useEffect(() => {
    AsyncStorage.setItem('days', days.toString());
  }, [days]);

  return (
    <SafeAreaView>
      <View className="min-h-screen bg-gray-500 pb-16">
        <ScrollView>
          {data &&
            data.CartItem.map(item => (
              <View
                className="flex flex-row items-center justify-between gap-2 bg-gray-600 p-2"
                key={item.id}>
                <Image
                  source={{
                    uri: `http://192.168.1.211:3001/image/${item.product.img}`,
                  }}
                  style={{width: 100, height: 100}}
                />
                <View>
                  <Text className="font-semibold text-white">
                    {item.product.name}
                  </Text>
                  <Text className="font-medium text-white">
                    {item.product.price}$
                  </Text>
                </View>
                <Button
                  title="Remove"
                  onPress={() => {
                    console.log('cart: ', cartId, 'item: ', item.id),
                      fetch(
                        `http://192.168.1.211:3001/cart/${cartId}/${item.product.id}`,
                        {
                          method: 'DELETE',
                          headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                          },
                        },
                      )
                        .then(response => {
                          if (response.ok) {
                            return response.json();
                          } else {
                            throw response;
                          }
                        })
                        .then(json => {
                          const newData = data.CartItem.filter(
                            item => item.id !== json.id,
                          );
                          setData({...data, CartItem: newData});
                        })
                        .catch(error => console.error(error));
                  }}
                />
              </View>
            ))}
          <View className="flex flex-col justify-between">
            <View className="mt-4 flex flex-row justify-between bg-gray-600 p-2">
              <Button title="+" onPress={() => setDays(days + 1)} />
              <Text className="p-2 font-semibold text-white">Days: {days}</Text>
              <Button title="-" onPress={() => setDays(days - 1)} />
            </View>
            <View className="mt-4 flex flex-row justify-between bg-gray-600 p-2">
              <Text className="p-2 font-semibold text-white">
                Total:{' '}
                {data
                  ? data.CartItem.reduce(
                      (acc, item) => acc + item.product.price,
                      0,
                    ) * days
                  : 0}
                ${' '}
              </Text>
            </View>
            <View className="mt-4">
              <Button
                title="Checkout"
                onPress={() => navigation.navigate('Checkout')}
              />
            </View>
          </View>
        </ScrollView>
      </View>
      <Menubar navigation={navigation} />
    </SafeAreaView>
  );
};

export default Cart;
