import { receiveDecks } from "./decks";
import { receiveCards } from "./cards";
import { getInitialData } from '../utils/api';

export function handleReceiveInitialData() {
  return (dispatch) => {

    // Get all decks and cards from device storage.
    return getInitialData()
      .then(({ cards, decks }) => {
        dispatch(receiveCards(cards));
        dispatch(receiveDecks(decks));
      })
      .catch((e) => {
        console.log('There was an error. Try Again.');
      });
  };
}