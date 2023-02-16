import type {NavigationProp} from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  Button,
  Pressable,
  Touchable,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {StyleSheet} from 'react-native';
import Home from '../Home';

const Menubar = ({navigation}: {navigation: NavigationProp<any>}) => {
  return (
    <TouchableOpacity
      className="absolute bottom-0 left-0 z-50 h-12 w-full flex-row justify-between bg-gray-600 p-2 align-middle"
      style={styles.container}>
      <Pressable
        onPress={() => {
          navigation.navigate('Home');
        }}>
        <Text className="font-bold text-white">Home</Text>
      </Pressable>
      <Button title="Cart" onPress={() => navigation.navigate('Cart')} />
      <Button title="Profile" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});

export default Menubar;
