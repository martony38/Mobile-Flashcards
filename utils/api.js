import { AsyncStorage } from 'react-native';

const DECK_STORAGE_KEY = 'MobileFlashCards:deck'
const CARD_STORAGE_KEY = 'MobileFlashCards:card'

const initial_decks = [
  {
    title: 'React',
    questions: [
      {
        question: 'What is React?',
        answer: 'A library for managing user interfaces'
      },
      {
        question: 'Where do you make Ajax requests in React?',
        answer: 'The componentDidMount lifecycle event'
      }
    ]
  },
  {
    title: 'JavaScript',
    questions: [
      {
        question: 'What is a closure?',
        answer: 'The combination of a function and the lexical environment within which that function was declared.'
      }
    ]
  }
]

function generateId(title) {
  // Replace white space from string
  // taken from (https://stackoverflow.com/questions/5963182/how-to-remove-spaces-from-a-string-using-javascript)
  return title.substr(0, 10).replace(/\s+/g, '') + Math.random().toString(36).substring(2, 15);
}

export function getInitialData() {
  return Promise.all([
    getCards(),
    getDecks(),
  ]).then(([cards, decks]) => ({
    cards,
    decks
  }));
}

function getItems(storageKey) {
  // Return all of the items for a specific storage key.

  return AsyncStorage.getAllKeys()
    .then((keys) => AsyncStorage.multiGet(keys.filter((key) => key.includes(storageKey))))
    .then((entries) => {
      let items = {};
      entries.map((entry) => {
        const id = entry[0].replace(storageKey + ':', '')
        let item = JSON.parse(entry[1])
        item.id = id;
        items[id] = item
      });
      return items;
    });
};

function getDecks() {
  // Return all of the decks.
  return getItems(DECK_STORAGE_KEY);
};

function getCards() {
  // Return all of the cards.
  return getItems(CARD_STORAGE_KEY);
};

function getItem(storageKey, id) {
  // Take in a storage key and id argument and return the item associated.

  return AsyncStorage.getItem(storageKey + ':' + id)
    .then((entry) => {
      let item = JSON.parse(entry);
      item.id = id;
      return item;
    })
};

function getDeck(id) {
  // Take in a single id argument and return the deck associated with that id.
  return getItem(DECK_STORAGE_KEY, id)
};

function getCard(id) {
  // Take in a single id argument and return the deck associated with that id.
  return getItem(CARD_STORAGE_KEY, id)
};

function formatDeck(title) {
  return {
    id: generateId(title),
    title,
    cards: []
  }
}

export function saveDeck(title) {
  // Take in a single title argument and add it to the decks.
  const deck = formatDeck(title);
  const { id, cards } = deck;

  return AsyncStorage.setItem(DECK_STORAGE_KEY + ':' + id, JSON.stringify({
    title,
    cards
  }))
    .then(() => deck);
};

export function deleteDeck(id) {
  getDeck(id)
    .then((deck) => {
      // Get all cards in deck.
      return AsyncStorage.multiGet(deck.cards.map((cardId) => CARD_STORAGE_KEY + ':' + cardId))
    })
    .then((entries) => {
      // Prepare info to update.
      const multiMergeArray = entries.map((entry) => {
        const decks = JSON.parse(entry[1]).decks.filter((deckId) => deckId !== id);
        const cardId = entry[0];

        return [cardId, { decks }];
      });

      return Promise.all([
        // Delete deck.
        AsyncStorage.removeItem(DECK_STORAGE_KEY + ':' + id),

        // Update all cards of this deck that exists in other decks as well.
        AsyncStorage.multiMerge(multiMergeArray.filter((pair) => pair[1].deckslength !== 0)),

        // Delete all cards of this deck not found in any other deck.
        AsyncStorage.multiRemove(
          multiMergeArray
            .filter((pair) => pair[1].deckslength === 0)
            .map((pair) => pair[0])
        )
      ]);
    });
}

function formatCard(deckId, question, answer) {
  return {
    id: generateId(question),
    question,
    answer,
    decks: [deckId]
  }
}

export function saveCard(deckId, question, answer) {
  const card = formatCard(deckId, question, answer);
  const { id, decks } = card;

  return AsyncStorage.setItem(CARD_STORAGE_KEY + ':' + id, JSON.stringify({
    answer,
    question,
    decks
  }))
    .then(() => card);
};

export function addCardToDeck(deckId, cardId) {
  // Take in two arguments, deck id and card id, and will add the card id to the list
  // of cards for the associated deck and add the deck id to the list of decks for the associated card.

  return Promise.all([
    getDeck(deckId),
    getCard(cardId),
  ]).then(([deck, card]) => {
    deck.cards.push(cardId);
    card.decks.push(deckId);

    const { answer, question, decks } = card;
    const { title, cards } = deck;

    return AsyncStorage.multiSet([
      [
        CARD_STORAGE_KEY + ':' + cardId,
        JSON.stringify({
          answer,
          question,
          decks
        })
      ],[
        DECK_STORAGE_KEY + ':' + deckId,
        JSON.stringify({
          title,
          cards
        })
      ]]);
  });
};

export function removeCardFromDeck(deckId, cardId) {
  return Promise.all([
    AsyncStorage.getDeck(deckId)
      .then((deck) => {
        const cards = deck.cards.filter((id) => id !== cardId);

        // Remove card from deck
        return AsyncStorage.mergeItem(DECK_STORAGE_KEY + ':' + deckId, { cards })
      }),
    getCard(cardId)
      .then((card) => {
        if (card.decks.length === 1) {
          // Delete card if card does not belong to any other deck.
          return AsyncStorage.removeItem(CARD_STORAGE_KEY + ':' + cardId);
        } else {
          const decks = card.decks.filter((id) => id !== deckId)
          // Update card if it still belongs to some other deck(s).
          return AsyncStorage.mergeItem(CARD_STORAGE_KEY + ':' + cardId, { decks });
        }
      })
  ]);
}
