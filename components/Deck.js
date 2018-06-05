import React, { Component } from 'react';
import { connect } from "react-redux";
import { TouchableOpacity, Text, View, Dimensions, ImageBackground } from 'react-native';
import styled from 'styled-components';
import { handleAddCard } from '../actions/cards';
import { DeckDescription, DeckTitle, DeckCard } from "./DeckList";
import { card, CardButton, ButtonText, CardText } from "./Card";

const TopOfDeck = styled(View)`
  ${card}
  justify-content: space-around;
  align-items: center;
`

const FullDeckTitle = styled(DeckTitle)`
  font-size: 20px;
  padding-left: 10px;
  padding-right: 10px;
`

class Deck extends Component {
  static navigationOptions = ({ navigation }) => {
    const title = navigation.getParam('title');

    return {
      title
    };
  }

  componentDidMount() {
    const { deck } = this.props;

    this.props.dispatch(handleAddCard(deck.id, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?', 'Eiusmod tempor incididunt ut labore.'));
    this.props.dispatch(handleAddCard(deck.id, 'Sed do eiusmod tempor incididunt ut labore?', 'Laboris nisi ut aliquip ex ea commodo.'));
    this.props.dispatch(handleAddCard(deck.id, 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur?', 'Excepteur sint occaecat cupidatat non proident.'));
    this.props.dispatch(handleAddCard(deck.id, 'Sunt in culpa qui officia deserunt?', 'Error sit voluptatem accusantium doloremque laudantium.'));
    this.props.dispatch(handleAddCard(deck.id, 'Laboris nisi ut aliquip ex ea commodo consequat?', 'Labore et dolore magna aliqua.'));
  }

  addCard = () => {
    const { id } = this.props.deck;

    this.props.navigation.navigate(
      'NewCard',
      { id }
    )
  }

  startQuiz = () => {
    const { title, cards } = this.props.deck;

    this.props.navigation.navigate(
      'Quiz',
      { title, cards, cardNumber: 1 }
    )
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
            <FullDeckTitle numberOfLines={6}>{deck.title}</FullDeckTitle>
            <DeckDescription>
              <CardText>{deck.cards.length}</CardText>
              <CardText>{`card${deck.cards.length === 1 ? '' : 's'}`}</CardText>
            </DeckDescription>
            <View>
              <CardButton
                style={{ backgroundColor: 'blue' }}
                onPress={this.addCard}
              >
                <ButtonText>Add Card</ButtonText>
              </CardButton>
              <CardButton
                style={{ backgroundColor: 'purple' }}
                onPress={this.startQuiz}
              >
                <ButtonText>Start Quiz</ButtonText>
              </CardButton>
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
