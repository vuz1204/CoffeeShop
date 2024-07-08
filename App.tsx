import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {MyTheme} from './src/theme/MyTheme';
import StackNavigator from './src/navigation/StackNavigator';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';

const App = () => {
  return (
    <MyTheme>
      <Provider store={store}>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </Provider>
    </MyTheme>
  );
};

export default App;
