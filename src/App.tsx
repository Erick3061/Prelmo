import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { HandleProvider } from './context/HandleContext';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { Provider as StoreProvider } from "react-redux";
import { AlertProvider } from './components/Alert/AlertContext';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { OrientationLocker } from 'react-native-orientation-locker';
import { store } from './app/store';
import { StackScreens } from './navigation/Stack';
import { setOrientation } from './features/appSlice';
import { Orientation } from './interfaces/interfaces';
import PortalHost from './components/Portal/PortalContext';


export const navigationRef = createNavigationContainerRef();

function App() {
  const queryClient = new QueryClient();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <StoreProvider store={store}>
          <PortalHost>
            <AlertProvider>
              <QueryClientProvider client={queryClient}>
                <HandleProvider>
                  <Root />
                </HandleProvider>
              </QueryClientProvider>
            </AlertProvider>
          </PortalHost>
        </StoreProvider>
      </SafeAreaProvider >
    </GestureHandlerRootView>
  )
}

export const Root = () => {
  const { theme } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  return (
    <NavigationContainer theme={theme} ref={navigationRef}>
      <OrientationLocker
        orientation='UNLOCK'
        onChange={resp => resp.includes('PORTRAIT') ? dispatch(setOrientation(Orientation.portrait)) : dispatch(setOrientation(Orientation.landscape))}
      />
      <StackScreens />
    </NavigationContainer>
  )
}

export const stylesApp = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.20,
    shadowRadius: 3,
    elevation: 3,
  }
});

export default App;