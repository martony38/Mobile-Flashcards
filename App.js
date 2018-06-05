import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Constants } from 'expo';
import reducer from './reducers';
import middleware from './middleware';
import DeckList from './components/DeckList';
import NewDeck from './components/NewDeck';
import Deck from './components/Deck';
import Quiz from './components/Quiz';
import NewCard from "./components/NewCard";

const Tabs = createBottomTabNavigator({
  DeckList: {
    screen: DeckList,
    navigationOptions: {
      tabBarLabel: 'List of decks',
      tabBarIcon: ({ tintColor }) => <MaterialCommunityIcons name='cards' size={30} color={tintColor} />
    }
  },
  NewDeck: {
    screen: NewDeck,
    navigationOptions: {
      tabBarLabel: 'New deck',
      tabBarIcon: ({ tintColor }) => <Ionicons name='ios-add' size={30} color={tintColor} />
    }
  }
},
{
  tabBarOptions: {
    activeTintColor: '#000',
    inactiveTintColor: 'rgb(192,214,221)',
    showLabel: false,
    style: {
      backgroundColor: 'rgb(105,169,57)',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: -1},
      shadowOpacity: 0.6,
      shadowRadius: 2
    }
  }
});

const MainNavigator = createStackNavigator({
  Home: Tabs,
  Deck: Deck,
  Quiz: Quiz,
  NewCard: NewCard
},{
  navigationOptions: {
    title: 'Mobile Flashcards',
    headerStyle: {
      backgroundColor: 'rgb(105,169,57)',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.8,
      shadowRadius: 2
    },
    headerTransparent: false,
    headerTintColor: '#000',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }
});

export default class App extends React.Component {
  render() {
    return (
      <Provider store={createStore(reducer, middleware)}>
        <View style={{flex: 1}}>
          <MainNavigator />
        </View>
      </Provider>
    );
  }
}
