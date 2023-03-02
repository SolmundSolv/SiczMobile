import {
  View,
  TextInput,
  ScrollView,
  Text,
  Image,
  Button,
  ToastAndroid,
} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationProp} from '@react-navigation/native';

function Login({navigation}: {navigation: NavigationProp<any>}) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  return (
    <View>
      <Text>Email</Text>
      <TextInput onChangeText={setEmail} />
      <Text>Password</Text>
      <TextInput onChangeText={setPassword} secureTextEntry />
      <Button
        title="Login"
        onPress={() => {
          fetch('http://192.168.1.211:3001/auth/signin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              password: password,
            }),
          })
            .then(response => {
              if (response.ok) {
                return response.json();
              } else {
                ToastAndroid.show(
                  'Invalid email or password',
                  ToastAndroid.SHORT,
                );
              }
            })
            .then(json => {
              AsyncStorage.setItem('token', json.access_token);
            })
            .then(() => {
              navigation.navigate('Home');
            });
        }}
      />
    </View>
  );
}

export default Login;
