import Home from '../screens/Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export const AppStack = () => {
    return (
    <Stack.Navigator screenOptions={
      {
        headerShown: false
      }
    }>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};