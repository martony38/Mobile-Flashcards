import React, { Component } from 'react';
import { connect } from "react-redux";
import { FlatList, Text, View, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import styled from 'styled-components';
import { card } from "./Card";

// Use to fill store for testing purposes
import { handleAddDeck } from "../actions/decks";


const DeckRow = styled(View)`
  flex-direction: row;
`

export const DeckCard = styled(View)`
  ${card}
  ${props => !props.lastOne && 'position: absolute;'}
  box-shadow: 0 1px 1px rgba(0,0,0,0.2);
`

export const TopOfDeck = styled(View)`
  ${card}
  justify-content: space-around;
  align-items: center;
`

export const DeckTitle = styled(Text)`
  font-weight: bold;
  text-align: center;
`

export const DeckDescription = styled(View)`
  align-items: center;
`

function Deck({ title, id, navigation, cards }) {
  const { width } = Dimensions.get('window');

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(
        'Deck',
        { title, id}
      )}
    >
      {cards.slice(0,10).map((card, index) => (
        <DeckCard
          offset={index}
          width={((width - 6 * 15) / 3)}
          lastOne={index === cards.length}
          key={card}
        />
      ))}
      <TopOfDeck
        offset={cards.length > 10 ? 9 : cards.length - 1}
        width={((width - 6 * 15) / 3)}
        style={{opacity: cards.length === 0 ? 0.5 : 1}}
      >
        <DeckTitle numberOfLines={3}>{title}</DeckTitle>
        <DeckDescription>
          <Text>{cards.length}</Text>
          <Text>{`card${cards.length === 1 ? '' : 's'}`}</Text>
        </DeckDescription>
      </TopOfDeck>
    </TouchableOpacity>
  )
}

class DeckList extends Component {
  componentDidMount() {
    // Fill store for testing purposes
    this.props.dispatch(handleAddDeck('Test Deck'));
    this.props.dispatch(handleAddDeck('Another Deck'));
    this.props.dispatch(handleAddDeck('Jamais Deux Sans Trois'));
  }

  renderDeckRow = ({ item }) => (
    <DeckRow
      numberOfDecks={item.length}
    >
      {item.map((deck) => (
        <Deck
          key={deck.id}
          title={deck.title}
          id={deck.id}
          cards={deck.cards}
          navigation={this.props.navigation}
        />
      ))}
    </DeckRow>
  )

  render() {
    const { decks } = this.props;
    const decksGroupedByThree = decks.reduce((acc, currentValue, index, array) => {
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
        {Object.keys(decks).length === 0
          ? <View>
              <Text>You do not have any deck.</Text>
            </View>
          : <FlatList
              data={decksGroupedByThree}
              renderItem={this.renderDeckRow}
              keyExtractor={(deck) => deck[0].id}
            />}
      </ImageBackground>
    );
  }
}

function mapStateToProps({ decks }) {
  return {
    decks: Object.keys(decks).map((key) => decks[key])
  };
}

export default connect(mapStateToProps)(DeckList);