// ============================================
// App.tsx - Main Application Entry Point
// ============================================
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;

// ============================================
// src/navigation/types.ts - Navigation Types
// ============================================
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  ProductDetails: { productId: number };
  SelectLocation: undefined;
  Search: undefined;
  OrderConfirmation: { orderId: number };
  OrderTracking: { orderId: number };
  AllOrders: undefined;
  Notifications: undefined;
  EditProfile: undefined;
  SavedAddresses: undefined;
  AddAddress: { editMode?: boolean; addressId?: number };
  HelpSupport: undefined;
  Offers: undefined;
  Wishlist: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Categories: undefined;
  Cart: undefined;
  Profile: undefined;
};

// ============================================
// src/navigation/RootNavigator.tsx
// ============================================
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

// Import Screens
import MainTabNavigator from './MainTabNavigator';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import SelectLocationScreen from '../screens/SelectLocationScreen';
import SearchScreen from '../screens/SearchScreen';
import OrderConfirmationScreen from '../screens/OrderConfirmationScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';
import AllOrdersScreen from '../screens/AllOrdersScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import SavedAddressesScreen from '../screens/SavedAddressesScreen';
import AddAddressScreen from '../screens/AddAddressScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import OffersScreen from '../screens/OffersScreen';
import WishlistScreen from '../screens/WishlistScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* Main Tab Navigator */}
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />

      {/* Modal Screens */}
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="SelectLocation"
        component={SelectLocationScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen
        name="OrderConfirmation"
        component={OrderConfirmationScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
      <Stack.Screen name="AllOrders" component={AllOrdersScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
      <Stack.Screen name="AddAddress" component={AddAddressScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="Offers" component={OffersScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;

// ============================================
// src/navigation/MainTabNavigator.tsx
// ============================================
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MainTabParamList } from './types';

// Import Screens
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Categories':
              iconName = focused ? 'grid' : 'grid-large';
              break;
            case 'Cart':
              iconName = focused ? 'cart' : 'cart-outline';
              break;
            case 'Profile':
              iconName = focused ? 'account' : 'account-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarBadge: route.name === 'Cart' ? 3 : undefined,
        tabBarBadgeStyle: styles.tabBarBadge,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          tabBarLabel: 'Categories',
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFF',
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabBarBadge: {
    backgroundColor: '#FF5252',
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    top: 3,
  },
});

export default MainTabNavigator;

// ============================================
// src/navigation/navigationService.ts
// ============================================
import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as never, params as never);
  }
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

export function reset(name: keyof RootStackParamList) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: name as never }],
    });
  }
}

// ============================================
// package.json - Required Dependencies
// ============================================
/*
{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.73.0",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/native-stack": "^6.9.17",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "react-native-screens": "^3.29.0",
    "react-native-safe-area-context": "^4.8.2",
    "react-native-vector-icons": "^10.0.3"
  }
}
*/

// ============================================
// Installation Instructions
// ============================================
/*

STEP 1: Install Dependencies
----------------------------
npm install @react-navigation/native
npm install @react-navigation/native-stack
npm install @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install react-native-vector-icons


STEP 2: iOS Setup
------------------
cd ios && pod install && cd ..


STEP 3: Android Setup (android/app/build.gradle)
-------------------------------------------------
Add this at the end of the file:

apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"


STEP 4: Configure MainActivity.java (Android)
----------------------------------------------
// android/app/src/main/java/com/yourapp/MainActivity.java

import android.os.Bundle;

public class MainActivity extends ReactActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }
  // ... rest of the code
}


STEP 5: Project Structure
--------------------------
src/
├── navigation/
│   ├── RootNavigator.tsx
│   ├── MainTabNavigator.tsx
│   ├── navigationService.ts
│   └── types.ts
├── screens/
│   ├── HomeScreen.tsx
│   ├── ProductDetailsScreen.tsx
│   ├── CartScreen.tsx
│   ├── CategoriesScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── SelectLocationScreen.tsx
│   ├── SearchScreen.tsx
│   ├── OrderConfirmationScreen.tsx
│   ├── OrderTrackingScreen.tsx
│   ├── AllOrdersScreen.tsx
│   ├── NotificationsScreen.tsx
│   ├── EditProfileScreen.tsx
│   ├── SavedAddressesScreen.tsx
│   ├── AddAddressScreen.tsx
│   ├── HelpSupportScreen.tsx
│   ├── OffersScreen.tsx
│   └── WishlistScreen.tsx
└── components/
    └── (shared components)

*/

// ============================================
// Example Usage in Screens
// ============================================

// HomeScreen.tsx - Example Navigation
/*
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleProductPress = (productId: number) => {
    navigation.navigate('ProductDetails', { productId });
  };

  const handleLocationPress = () => {
    navigation.navigate('SelectLocation');
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  // ... rest of component
};
*/

// ProductDetailsScreen.tsx - Example with Params
/*
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

type ProductDetailsRouteProp = RouteProp<RootStackParamList, 'ProductDetails'>;

const ProductDetailsScreen = () => {
  const route = useRoute<ProductDetailsRouteProp>();
  const { productId } = route.params;

  // Fetch product using productId
  // ... rest of component
};
*/

// CartScreen.tsx - Example Navigation to Order Confirmation
/*
const CartScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePlaceOrder = async () => {
    // Place order logic
    const orderId = await placeOrder();
    
    // Navigate to order confirmation
    navigation.navigate('OrderConfirmation', { orderId });
  };

  // ... rest of component
};
*/

// ============================================
// Deep Linking Configuration (Optional)
// ============================================
/*
// App.tsx with Deep Linking

const linking = {
  prefixes: ['quickmart://', 'https://quickmart.com'],
  config: {
    screens: {
      MainTabs: {
        screens: {
          Home: 'home',
          Categories: 'categories',
          Cart: 'cart',
          Profile: 'profile',
        },
      },
      ProductDetails: 'product/:productId',
      OrderTracking: 'order/:orderId/track',
      SelectLocation: 'location',
      Search: 'search',
    },
  },
};

<NavigationContainer linking={linking}>
  <RootNavigator />
</NavigationContainer>
*/

// ============================================
// Navigation Guards Example (Authentication)
// ============================================
/*
// src/navigation/AuthNavigator.tsx

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthStackNavigator from './AuthStackNavigator';
import RootNavigator from './RootNavigator';

const AuthNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return isAuthenticated ? <RootNavigator /> : <AuthStackNavigator />;
};

export default AuthNavigator;
*/

// ============================================
// Common Navigation Patterns
// ============================================

/*
// 1. Navigate with parameters
navigation.navigate('ProductDetails', { productId: 123 });

// 2. Go back
navigation.goBack();

// 3. Navigate and reset stack
navigation.reset({
  index: 0,
  routes: [{ name: 'Home' }],
});

// 4. Replace current screen
navigation.replace('OrderConfirmation', { orderId: 456 });

// 5. Pop to top of stack
navigation.popToTop();

// 6. Navigate to nested screen
navigation.navigate('MainTabs', {
  screen: 'Home',
  params: { /* params */ },
});

// 7. Check if can go back
if (navigation.canGoBack()) {
  navigation.goBack();
}

// 8. Listen to navigation events
useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    // Screen is focused
    console.log('Screen focused');
  });

  return unsubscribe;
}, [navigation]);

// 9. Get current route name
const routeName = navigation.getCurrentRoute()?.name;

// 10. Prevent going back
useEffect(() => {
  const beforeRemove = (e: any) => {
    e.preventDefault();
    // Show confirmation dialog
  };
  
  navigation.addListener('beforeRemove', beforeRemove);
  
  return () => navigation.removeListener('beforeRemove', beforeRemove);
}, [navigation]);
*/

// ============================================
// Custom Tab Bar Example (Advanced)
// ============================================
/*
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
          >
            <Icon
              name={getIconName(route.name, isFocused)}
              size={24}
              color={isFocused ? '#4CAF50' : '#999'}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isFocused ? '#4CAF50' : '#999' }
              ]}
            >
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// Usage in MainTabNavigator:
// <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
*/

console.log('QuickMart Navigation Setup Complete!');
console.log('Follow the installation instructions above to set up navigation.');
