import React, { Component } from 'react';
import { TouchableOpacity, Text, View, ImageBackground } from 'react-native';
import styled from 'styled-components';
import Card, { CardButton, ButtonText } from "./Card";

const QuizScore = styled(Text)`
  font-size: 100px;
  color: rgb(105,169,57);
  text-shadow: -1px 1px 10px rgba(0, 0, 0, 0.75);
`

const QuizScoreView = styled(View)`
  flex: 1;
  justify-content: space-around;
  align-items: center;
`

export default class Quiz extends Component {
  static navigationOptions = ({ navigation }) => {
    const cards = navigation.getParam('cards');
    const cardNumber = navigation.getParam('cardNumber');

    const title = cardNumber > cards.length ? 'Quiz Score' : `Quiz ${cardNumber}/${cards.length}`

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
    const cardNumber = 1 + this.state.correctAnswers + this.state.wrongAnswers
    this.props.navigation.setParams({ cardNumber });
  }

  answerCorrect = () => {
    this.setState((prevState) => ({ correctAnswers: prevState.correctAnswers + 1 }));
    this.goToNextCard();
  }

  answerIncorrect = () => {
    this.setState((prevState) => ({ wrongAnswers: prevState.wrongAnswers + 1 }));
    this.goToNextCard();
  }

  retakeQuiz = () => {
    this.props.navigation.setParams({ cardNumber: 1 });
    this.setState({
      cards: this.props.navigation.getParam('cards'),
      correctAnswers: 0,
      wrongAnswers: 0
    });
  }

  render() {
    const { cards, correctAnswers, wrongAnswers } = this.state;

    return (
      <ImageBackground style={{flex: 1}} source={require('../img/wood-background.jpg')}>
        <View style={{flex: 1, alignItems: 'center'}}>
          {cards.length > 0
            ? <Card
                id={cards[0]}
                answerCorrect={this.answerCorrect}
                answerIncorrect={this.answerIncorrect}
              />
            : <QuizScoreView>
                <QuizScore>{(correctAnswers / (correctAnswers + wrongAnswers) * 100).toFixed()} %</QuizScore>
                <View>
                  <CardButton
                    color={'blue'}
                    onPress={this.retakeQuiz}
                  >
                    <ButtonText>Retake Quiz</ButtonText>
                  </CardButton>
                  <CardButton
                    color={'rgb(105,169,57)'}
                    onPress={() => { this.props.navigation.goBack() }}
                  >
                    <ButtonText>Back to Deck</ButtonText>
                  </CardButton>
                </View>
              </QuizScoreView>}
        </View>
      </ImageBackground>
    );
  }
}
