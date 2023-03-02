import {Button, ScrollView, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationProp} from '@react-navigation/native';
import Menubar from './components/Menubar';

export type User = {
  user: {
    id: string;
    name: string;
    email: string;
    role: {name: string};
    phone: string;
    adress: {
      street: string;
      city: string;
      zip: string;
      country: string;
      building: string;
    };
    isEmployee: boolean;
  };
};

type Order = {
  id: string;
  number: string;
  price: number;
  createdAt: string;
  status: {name: string};
};

function Profile({navigation}: {navigation: NavigationProp<any>}) {
  const [isLoading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [data, setData] = useState<User | null>(null);
  const token = AsyncStorage.getItem('token');
  function fetchProfile() {
    token.then(value => {
      if (!value) {
        setLoading(false);
        setLoggedIn(false);
        return;
      }
      setLoggedIn(true);
      fetch('http://192.168.1.211:3001/user/me', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${value}`,
        },
      })
        .then(response => {
          if (!response.ok) {
            setLoggedIn(false);
            setLoading(false);
            return;
          } else {
            return response.json();
          }
        })
        .then(json => {
          setData(json);
          return json;
        })
        .then(json => {
          if (json)
            fetch('http://192.168.1.211:3001/order/user/' + json.user.id, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .then(res => res.json())
              .then(data => {
                setOrders(data);
                setLoading(false);
              });
        })
        .catch(error => console.error(error))
        .finally(() => setLoading(false));
    });
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!loggedIn) {
    return (
      <View className="h-full items-center justify-center bg-gray-600">
        <Text className="mb-6 text-2xl text-white">Not logged in</Text>
        <Button title="Login" onPress={() => navigation.navigate('Login')} />
        <Menubar navigation={navigation} />
      </View>
    );
  }

  return (
    <View className="h-full">
      <ScrollView className="mb-12 gap-4 bg-gray-600 text-white">
        <View className=" bg-gray-700 p-4">
          <View className="flex flex-row justify-between">
            <Text className="text-2xl font-medium text-white">Account</Text>
            <Button
              title="Logout"
              onPress={() => {
                fetch('http://192.168.1.211:3001//auth/logout', {
                  method: 'POST',

                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    token: token,
                  }),
                }).then(() => {
                  AsyncStorage.removeItem('token').then(() => {
                    navigation.navigate('Home');
                  });
                });
              }}
            />
          </View>
          <View className="p-4">
            <Text className="font-medium text-white">Name</Text>
            <Text className="text-2xl text-white">{data?.user.name}</Text>
            <Text className="font-medium text-white">Email</Text>
            <Text className="text-2xl text-white">{data?.user.email}</Text>
            <Text className="font-medium text-white">Phone</Text>
            <Text className="text-2xl text-white">{data?.user.phone}</Text>
          </View>
        </View>
        <View className="bg-gray-700 p-4">
          <Text className="text-2xl font-medium text-white">Orders</Text>
          <View className="p-4">
            {orders?.length !== 0 &&
              orders?.map(order => (
                <View
                  className="border-b border-gray-200 px-4 py-5 dark:border-gray-600 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6"
                  key={order.id}>
                  <View className="flex flex-row justify-between text-sm font-medium">
                    <Text className="text-white">Number: </Text>
                    <Text className="text-white">#{order.number}</Text>
                  </View>
                  <View className="flex flex-row justify-between text-sm font-medium">
                    <Text className="text-white">Price: </Text>
                    <Text className="text-white">{order.price} $</Text>
                  </View>
                  <View className="flex flex-row justify-between text-sm font-medium">
                    <Text className="text-white">Date: </Text>
                    <Text className="text-white">
                      {order.createdAt.split('T')[0]}
                    </Text>
                  </View>
                  <View className="flex flex-row justify-between text-sm font-medium">
                    <Text className="text-white">Status: </Text>
                    <Text className="text-white">{order.status.name}</Text>
                  </View>
                </View>
              ))}
          </View>
        </View>

        <View className="bg-gray-700 p-4">
          <Text className="text-2xl font-medium text-white">
            Shipping Addres
          </Text>
          <View className="p-4">
            <Text className="font-medium text-white">Street</Text>
            <Text className="text-2xl text-white">
              {data?.user.adress.street}
            </Text>
            <Text className="font-medium text-white">City</Text>
            <Text className="text-2xl text-white">
              {data?.user.adress.city}
            </Text>
            <Text className="font-medium text-white">Zip</Text>
            <Text className="text-2xl text-white">{data?.user.adress.zip}</Text>
            <Text className="font-medium text-white">Country</Text>
            <Text className="text-2xl text-white">
              {data?.user.adress.country}
            </Text>
            <Text className="font-medium text-white">Building</Text>
            <Text className="text-2xl text-white">
              {data?.user.adress.building}
            </Text>
          </View>
        </View>
      </ScrollView>
      <Menubar navigation={navigation} />
    </View>
  );
}

export default Profile;
