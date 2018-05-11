import { RECEIVE_DECKS, ADD_DECK, REMOVE_DECK } from '../actions/decks';
import { ADD_CARD, REMOVE_CARD } from '../actions/cards';

export default function decks (state = {}, action) {
  switch (action.type) {
    case RECEIVE_DECKS :
      return {
        ...state,
        ...action.decks
      };
    case ADD_DECK :
      return {
        ...state,
        [action.deck.id]: action.deck
      };
    case REMOVE_DECK :
      // Remove object property without mutating.
      // Inspired from :
      // https://github.com/erikras/react-redux-universal-hot-example/issues/962
      // https://blog.ricardofilipe.com/post/immutable-changes-in-js)
      return Object.keys(state)
        .filter((id) => id !== action.id)
        .reduce((acc, id) => ({...acc, [id]: state[id]}), {});
    case ADD_CARD :
      return {
        ...state,
        [action.deckId]: {
          ...state[action.deckId],
          cards: [
            ...state[action.deckId].cards,
            action.card.id
          ]
        }
      };
    case REMOVE_CARD :
      return {
        ...state,
        [action.deckId]: {
          ...state[action.deckId],
          cards: state[action.deckId].cards.filter((id) => id !== action.cardId)
        }
      };
    default :
      return state;
  }
};
