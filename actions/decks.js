import { saveDeck, deleteDeck } from '../utils/api';

export const RECEIVE_DECKS = 'RECEIVE_DECKS';
export const ADD_DECK = 'ADD_DECK';
export const REMOVE_DECK = 'REMOVE_DECK';

export function receiveDecks(decks) {
  return {
    type: RECEIVE_DECKS,
    decks
  };
};

function addDeck(deck) {
  return {
    type: ADD_DECK,
    deck
  };
};

export function handleAddDeck(title) {
  return (dispatch) => {
    // Save deck to device storage.
    return saveDeck(title)
      .then((deck) => {
        dispatch(addDeck(deck));
        return deck.id;
      })
      .catch((e) => {
        console.log('There was an error. Try Again.');
      });
  };
}

function removeDeck(id) {
  return {
    type: REMOVE_DECK,
    id
  };
}

export function handleRemoveDeck(id) {
  return (dispatch) => {
    // Delete deck from device storage.
    return deleteDeck(id)
      .then(() => dispatch(removeDeck(id)))
      .catch((e) => {
        console.log('There was an error. Try Again.');
      });
  };
}


