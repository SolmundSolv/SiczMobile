import {View, TextInput, ScrollView, Text, Image, Button} from 'react-native';
import React from 'react';
import type {NavigationProp} from '@react-navigation/native';
import Menubar from './components/Menubar';
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  img: string;
};
function Home({navigation}: {navigation: NavigationProp<any>}) {
  const [isLoading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<Product[]>([]);

  function fetchProducts() {
    fetch('http://192.168.1.211:3001/model', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }
  React.useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <View>
      <ScrollView className="gap-2 bg-gray-500 p-2 pb-12">
        <ScrollView className="flex flex-col bg-gray-600 pb-16">
          {isLoading ? (
            <View className="h-screen">
              <Text>Loading...</Text>
            </View>
          ) : (
            data.map((product: Product) => (
              <View key={product.id} className="m-2 bg-gray-500 p-6 text-white">
                <Image
                  source={{
                    uri: `http://192.168.1.211:3001/image/${product.img}`,
                  }}
                  className="aspect-square h-auto w-full"
                />
                <View className="mt-4 flex flex-row justify-between">
                  <Text className="font-bold text-white">{product.name}</Text>
                  <Text className="font-bold text-white">${product.price}</Text>
                </View>
                <Button
                  onPress={() => {
                    navigation.navigate('Product', {product: product});
                  }}
                  title="View"
                />
              </View>
            ))
          )}
        </ScrollView>
      </ScrollView>
      <Menubar navigation={navigation} />
    </View>
  );
}
export default Home;
