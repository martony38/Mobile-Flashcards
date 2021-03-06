import { saveCard, addCardToDeck, removeCardFromDeck, updateCard } from '../utils/api';

export const ADD_CARD = 'ADD_CARD';
export const EDIT_CARD = 'EDIT_CARD';
export const REMOVE_CARD = 'REMOVE_CARD';
export const RECEIVE_CARDS = 'RECEIVE_CARDS';

export function receiveCards(cards) {
  return {
    type: RECEIVE_CARDS,
    cards
  };
};

function addCard(deckId, card) {
  return {
    type: ADD_CARD,
    deckId,
    card
  };
};

export function handleAddCard(deckId, question, answer) {
  return (dispatch) => {
    // Save card to device storage.
    const saveCardOnDevice = saveCard(deckId, question, answer);
    const updateDeckOnDevice = saveCardOnDevice.then((card) => addCardToDeck(deckId, card.id))

    return Promise.all([
      saveCardOnDevice,
      updateDeckOnDevice
    ]).then(([card, ...rest]) => dispatch(addCard(deckId, card)))
      .catch((e) => {
        console.log('There was an error. Try Again.');
      });
  };
}

function removeCard(deckId, cardId) {
  return {
    type: REMOVE_CARD,
    deckId,
    cardId
  };
};

export function handleRemoveCard(deckId, cardId) {
  return (dispatch) => {
    // Remove card from deck on device storage.
    return removeCardFromDeck(deckId, cardId)
      .then(() => dispatch(removeCard(deckId, cardId)))
      .catch((e) => {
        console.log('There was an error. Try Again.');
      });
  };
}

function editCard(id, question, answer) {
  return {
    type: EDIT_CARD,
    id,
    question,
    answer
  }
}

export function handleEditCard(id, question, answer) {
  return (dispatch) => {
    return updateCard(id, question, answer)
      .then(() => {
        dispatch(editCard(id, question, answer));
      })
      .catch((e) => {
        console.log('There was an error. Try Again.');
      });
  };
}