import { combineReducers } from 'redux';
import cards from './cards';
import decks from './decks';

const appReducer = combineReducers({
  decks,
  cards
});

export default appReducer;
