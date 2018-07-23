import { receiveDecks } from './decks';
import { receiveCards } from './cards';
import { receiveLocalNotifications } from './notifications';
import { getInitialData } from '../utils/api';

export function handleReceiveInitialData() {
  return (dispatch) => {

    // Get all decks and cards from device storage.
    return getInitialData()
      .then(({ cards, decks, localNotifications }) => {
        dispatch(receiveCards(cards));
        dispatch(receiveDecks(decks));
        dispatch(receiveLocalNotifications(localNotifications));
      })
      .catch((e) => {
        console.log('Error while loading your data. Please try closing and reopening the App.');
      });
  };
}