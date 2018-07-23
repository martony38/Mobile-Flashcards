import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, Text, View, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import styled from 'styled-components';
import { handleAddLocalNotification } from '../actions/notifications';
import { TopOfDeck, DeckCard, DeckTitle, DeckDescription } from './Deck';
import { groupByThree } from '../utils/helpers';

export const DeckRow = styled(View)`
  flex-direction: row;
`

export const NoDeckText = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`

function SmallDeck({ title, id, navigation, cards }) {
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
          small
          offset={index}
          cardWidth={((width - 6 * 5) / 3)}
          lastOne={index === cards.length}
          key={card}
        />
      ))}
      <TopOfDeck
        small
        offset={cards.length > 10 ? 9 : cards.length - 1}
        cardWidth={((width - 6 * 5) / 3)}
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

export class ItemList extends Component {
  render() {
    const { items, type, renderRow } = this.props;

    return (
      <ImageBackground style={{flex: 1}} source={require('../img/wood-background.jpg')}>
        {Object.keys(items).length === 0
          ? <NoDeckText>
              {type === 'Deck'
                ? <Text>You do not have any deck.</Text>
                : <Text>This deck is empty.</Text>}
            </NoDeckText>
          : <FlatList
              data={groupByThree(items)}
              renderItem={renderRow}
              keyExtractor={(item) => item[0].id}
            />}
      </ImageBackground>
    );
  }
}

class DeckList extends Component {
  componentDidMount() {
    const { dispatch, localNotifications } = this.props;

    if (Object.values(localNotifications).filter((value) => value === true).length === 0) {
      dispatch(handleAddLocalNotification());
    }
  }

  renderDeckRow = ({ item }) => (
    <DeckRow>
      {item.map((deck) => (
        <SmallDeck
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

    return (
      <ItemList
        items={decks}
        type='Deck'
        renderRow={this.renderDeckRow}
      />
    );
  }
}

function mapStateToProps({ decks, localNotifications }) {
  return {
    decks: Object.keys(decks).map((key) => decks[key]),
    localNotifications
  };
}

export default connect(mapStateToProps)(DeckList);