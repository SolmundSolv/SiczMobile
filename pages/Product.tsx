import {NavigationProp, RouteProp} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Button,
  SafeAreaView,
} from 'react-native';
import Menubar from './components/Menubar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ToastAndroid} from 'react-native';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  img: string;
  availableQuantity: number;
  ModelDetails: {
    id: string;
    name: string;
    value: string;
  }[];
};
function ProductPage({
  navigation,
  route,
}: {
  navigation: NavigationProp<any>;
  route: RouteProp<any, any>;
}) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Product | null>(null);
  const product = route?.params?.product;
  function getDetails() {
    fetch(`http://192.168.1.211:3001/model/${product.id}`, {
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
  useEffect(() => {
    getDetails();
  }, []);
  return (
    <SafeAreaView>
      <ScrollView className="pb-16">
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <View className="flex min-h-screen gap-2 bg-gray-500 pb-16">
            <View className="flex gap-4 p-2">
              <Text className="text-2xl font-bold text-white ">
                {data?.name}
              </Text>
              <Image
                source={{
                  uri: `http://192.168.1.211:3001/image/${data?.img}`,
                }}
                className="aspect-square h-auto object-cover p-2"
              />
              <View className="mt-4 flex flex-row justify-between">
                <Button
                  title="Add to Carts"
                  onPress={async () => {
                    const cart = await AsyncStorage.getItem('cart');
                    if (!cart) {
                      fetch(`http://192.168.1.211:3001/cart`, {
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
                            console.log(response);
                            throw response;
                          }
                        })
                        .then(json => AsyncStorage.setItem('cart', json.id));
                    }
                    fetch(
                      `http://192.168.1.211:3001/cart/${await AsyncStorage.getItem(
                        'cart',
                      )}`,
                      {
                        method: 'POST',
                        headers: {
                          Accept: 'application/json',
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          productId: data?.id,
                        }),
                      },
                    )
                      .then(response => {
                        if (response.ok) {
                          ToastAndroid.show(
                            'Added to cart',
                            ToastAndroid.SHORT,
                          );
                          return response.json();
                        } else {
                          ToastAndroid.show(
                            'Product is already added',
                            ToastAndroid.SHORT,
                          );
                        }
                      })
                      .then(json => console.log(json))
                      .catch(error => console.error(error))
                      .finally(() => setLoading(false));
                  }}
                />
                <Text className="text-xl font-bold text-white ">
                  ${data?.price}
                </Text>
              </View>
              <Text className="text-md font-semibold text-white">
                {data?.description}
              </Text>
            </View>
            <View className="gap-4 p-2">
              <Text className="text-2xl font-bold text-white ">Details</Text>
              {data?.ModelDetails.map(detail => (
                <View
                  className="mt-4 flex flex-row justify-between border-b border-gray-400"
                  key={detail.id}>
                  <Text className="text-xl font-bold text-white ">
                    {detail.name}
                  </Text>
                  <Text className="text-xl font-semibold text-white ">
                    {detail.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
      <Menubar navigation={navigation} />
    </SafeAreaView>
  );
}
export default ProductPage;
