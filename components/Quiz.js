import React, { Component } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import Card from "./Card";

export default class Quiz extends Component {
  static navigationOptions = ({ navigation }) => {
    const title = navigation.getParam('title');

    return {
      title
    };
  }

  state = {
    cards: this.props.navigation.getParam('cards'),
    correctAnswers: 0,
    wrongAnswers: 0
  }

  goToNextCard = () => {
    this.setState((prevState) => {
      const cardId = prevState.cards[0];
      return { cards: prevState.cards.filter((id) => id !== cardId) }
    });
  }

  answerCorrect = () => {
    this.setState((prevState) => ({ correctAnswers: prevState.correctAnswers + 1 }));
    this.goToNextCard();
  }

  answerIncorrect = () => {
    this.setState((prevState) => ({ wrongAnswers: prevState.wrongAnswers + 1 }));
    this.goToNextCard();
  }

  render() {
    const { cards, correctAnswers, wrongAnswers } = this.state;

    return (
      <View>
        {cards.length > 0
          ? <Card
              id={cards[0]}
              answerCorrect={this.answerCorrect}
              answerIncorrect={this.answerIncorrect}
            />
          : <Text>Correct Answers: {(correctAnswers / (correctAnswers + wrongAnswers) * 100).toFixed()} %</Text>}
      </View>
    );
  }
}
