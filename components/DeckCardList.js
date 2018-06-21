import React, { Component } from 'react';
import { connect } from "react-redux";
import { FlatList, Text, View, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import styled from 'styled-components';
import { TopOfDeck, DeckCard, DeckTitle, DeckDescription } from './Deck';

const CardRow = styled(View)`
  flex-direction: row;
`

function Card({ id, navigation, question, answer }) {
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
        width={((width - 6 * 5) / 3)}
        lastOne={false}
      />
      <TopOfDeck
        small
        offset={0}
        width={((width - 6 * 5) / 3)}
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
    <CardRow>
      {item.map((card) => (
        <Card
          key={card.id}
          question={card.question}
          answer={card.answer}
          id={card.id}
          navigation={this.props.navigation}
        />
      ))}
    </CardRow>
  )

  render() {
    const { cards } = this.props;
    const cardsGroupedByThree = cards.reduce((acc, currentValue, index, array) => {
      if (acc.length === 0) {
        acc.push([currentValue]);
      } else if (acc[acc.length - 1].length < 3) {
        acc[acc.length - 1].push(currentValue);
      } else {
        acc.push([currentValue]);
      }
      return acc
    },[]);

    return (
      <ImageBackground style={{flex: 1}} source={require('../img/wood-background.jpg')}>
        {Object.keys(cards).length === 0
          ? <View>
              <Text>This deck is empty.</Text>
            </View>
          : <FlatList
              data={cardsGroupedByThree}
              renderItem={this.renderCardRow}
              keyExtractor={(card) => card[0].id}
            />}
      </ImageBackground>
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