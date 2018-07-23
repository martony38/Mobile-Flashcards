import { combineReducers } from 'redux';
import cards from './cards';
import decks from './decks';
import localNotifications from './notifications';

const appReducer = combineReducers({
  decks,
  cards,
  localNotifications
});

export default appReducer;
