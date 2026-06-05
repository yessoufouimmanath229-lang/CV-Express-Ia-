import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import HomeScreen from '../screens/HomeScreen';
import FormScreen from '../screens/FormScreen';
import PreviewScreen from '../screens/PreviewScreen';
import HistoryScreen from '../screens/HistoryScreen';
import PremiumScreen from '../screens/PremiumScreen';
import AuthScreen from '../screens/AuthScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

function CreationStack() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: t('common.nav_home') }} 
      />
      <Stack.Screen 
        name="Form" 
        component={FormScreen} 
        options={{ title: t('common.nav_info') }} 
      />
      <Stack.Screen 
        name="Preview" 
        component={PreviewScreen} 
        options={{ title: t('common.nav_preview') }} 
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Creation') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Creation" 
        component={CreationStack} 
        options={{ title: t('common.nav_create') }} 
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen} 
        options={{ title: t('common.nav_history') }} 
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false, presentation: 'modal' }}>
        <RootStack.Screen name="Main" component={MainTabs} />
        <RootStack.Screen name="Premium" component={PremiumScreen} />
        <RootStack.Screen name="Auth" component={AuthScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
