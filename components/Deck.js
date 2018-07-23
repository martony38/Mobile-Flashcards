import React, { Component } from 'react';
import { connect } from "react-redux";
import { Text, View, Dimensions, ImageBackground } from 'react-native';
import styled from 'styled-components';
import { card, CardText } from "./Card";
import { handleRemoveDeck } from '../actions/decks';
import TextButton from "./TextButton";

export const TopOfDeck = styled(View)`
  ${card}
  justify-content: space-around;
  align-items: center;
`

export const DeckCard = styled(View)`
  ${card}
  ${props => !props.lastOne && 'position: absolute;'}
  box-shadow: 0 1px 1px rgba(0,0,0,0.2);
`

export const DeckTitle = styled(Text)`
  font-weight: bold;
  text-align: center;
`

export const DeckDescription = styled(View)`
  align-items: center;
`

const DeckText = styled(View)`
  justify-content: space-around;
  align-items: center;
`

const FullDeckTitle = styled(DeckTitle)`
  font-size: 20px;
  padding-left: 10px;
  padding-right: 10px;
  text-align: center;
`

class Deck extends Component {
  static navigationOptions = ({ navigation }) => {
    const title = navigation.getParam('title');

    return {
      title
    };
  }

  addCard = () => {
    const { id } = this.props.deck;

    this.props.navigation.navigate(
      'NewCard',
      { id }
    )
  }

  startQuiz = () => {
    const { title, cards, id } = this.props.deck;

    this.props.navigation.navigate(
      'Quiz',
      { title, cards, id, cardNumber: 1 }
    )
  }

  viewAllCards = () => {
    const { id } = this.props.deck;
    const title = this.props.navigation.getParam('title');

    this.props.navigation.navigate(
      'DeckCardList',
      { id, title }
    )
  }

  deleteDeck = () => {
    const { id } = this.props.deck;

    this.props.dispatch(handleRemoveDeck(id));

    this.props.navigation.goBack();
  }

  shouldComponentUpdate(nextProps) {
    const { deck } = nextProps;

    if (deck) {
      return true
    } else {
      return false
    }
  }

  render() {
    const { width } = Dimensions.get('window');
    const { deck } = this.props;

    return (
      <ImageBackground style={{ flex: 1, alignItems: 'center' }} source={require('../img/wood-background.jpg')}>
        <View>
          {deck.cards.slice(0,10).map((card, index) => (
            <DeckCard
              offset={index}
              width={(width - 2 * 15)}
              lastOne={index === deck.cards.length}
              key={card}
            />
          ))}
          <TopOfDeck
            offset={deck.cards.length > 10 ? 9 : deck.cards.length - 1}
            width={(width - 2 * 15)}
          >
            <DeckText>
              <FullDeckTitle numberOfLines={6}>{deck.title}</FullDeckTitle>
              <DeckDescription>
                <CardText>{deck.cards.length}</CardText>
                <CardText>{`card${deck.cards.length === 1 ? '' : 's'}`}</CardText>
              </DeckDescription>
            </DeckText>
            <View>
              <View>
                <TextButton
                  color={'purple'}
                  onPress={this.startQuiz}
                  disabled={deck.cards.length === 0}
                >
                  Start Quiz
                </TextButton>
              </View>
              <View>
                <TextButton
                  color={'blue'}
                  onPress={this.addCard}
                >
                  Add Card
                </TextButton>
                <TextButton
                  color={'black'}
                  onPress={this.viewAllCards}
                  disabled={deck.cards.length === 0}
                >
                  Show Cards
                </TextButton>
              </View>
              <View>
                <TextButton
                  color={'red'}
                  onPress={this.deleteDeck}
                >
                  Delete Deck
                </TextButton>
              </View>
            </View>
          </TopOfDeck>
        </View>
      </ImageBackground>
    );
  }
}

function mapStateToProps({ decks }, { navigation }) {
  const deck = decks[navigation.getParam('id')]

  return {
    deck
  };
}

export default connect(mapStateToProps)(Deck);
