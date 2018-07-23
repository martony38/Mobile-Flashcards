import React, { Component } from 'react';
import { connect } from "react-redux";
import { Text, TouchableOpacity, Dimensions } from 'react-native';
import { TopOfDeck, DeckCard, DeckTitle, DeckDescription } from './Deck';
import { DeckRow, ItemList } from './DeckList';

function SmallCard({ id, navigation, question, answer }) {
  const { width } = Dimensions.get('window');

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(
        'EditCard',
        { id, deckId: navigation.getParam('id') }
      )}
    >
      <DeckCard
        small
        offset={0}
        cardWidth={((width - 6 * 5) / 3)}
        lastOne={false}
      />
      <TopOfDeck
        small
        offset={0}
        cardWidth={((width - 6 * 5) / 3)}
      >
        <DeckTitle numberOfLines={3}>{question}</DeckTitle>
        <DeckDescription>
          <Text numberOfLines={3} style={{ textAlign: 'center' }}>{answer}</Text>
        </DeckDescription>
      </TopOfDeck>
    </TouchableOpacity>
  )
}

class DeckCardList extends Component {
  static navigationOptions = ({ navigation }) => {
    const title = navigation.getParam('title');

    return {
      title: `${title} Cards`
    };
  }

  renderCardRow = ({ item }) => (
    <DeckRow>
      {item.map((card) => (
        <SmallCard
          key={card.id}
          question={card.question}
          answer={card.answer}
          id={card.id}
          navigation={this.props.navigation}
        />
      ))}
    </DeckRow>
  )

  render() {
    const { cards } = this.props;

    return (
      <ItemList
        items={cards}
        type='Card'
        renderRow={this.renderCardRow}
      />
    );
  }
}

function mapStateToProps({ decks, cards }, { navigation }) {
  const deck = decks[navigation.getParam('id')];

  return {
    cards: deck.cards.map((id) => cards[id])
  };
}

export default connect(mapStateToProps)(DeckCardList);