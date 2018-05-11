import { RECEIVE_CARDS, REMOVE_CARD, ADD_CARD } from "../actions/cards";

export default function cards (state = {}, action) {
  switch (action.type) {
    case RECEIVE_CARDS :
      return {
        ...state,
        ...action.cards
      };
    case ADD_CARD :
      return {
        ...state,
        [action.card.id]: action.card
      };
    case REMOVE_CARD :
      const decks = state[action.cardId].decks.filter((id) => id !== action.deckId);

      return decks.length === 0
        // Remove object property without mutating.
        // Inspired from :
        // https://github.com/erikras/react-redux-universal-hot-example/issues/962
        // https://blog.ricardofilipe.com/post/immutable-changes-in-js)
        ? Object.keys(state)
            .filter((id) => id !== action.cardId)
            .reduce((acc, id) => ({...acc, [id]: state[id]}), {})
        : {
            ...state,
            [action.cardId]: {
              ...state[action.cardId],
              decks
            }
          };
    default :
      return state;
  }
};
