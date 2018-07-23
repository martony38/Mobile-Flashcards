import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View, ImageBackground } from 'react-native';
import styled from 'styled-components';
import Card from './Card';
import TextButton from './TextButton';
import { handleAddLocalNotification, handleRemoveLocalNotification } from '../actions/notifications';

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

class Quiz extends Component {
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

    if (cards.length === 0) {
      const { dispatch, localNotifications } = this.props;

      const currentNotifications = Object.keys(localNotifications).filter((id) => localNotifications[id] === true);

      if (currentNotifications.length !== 0) {
        // Get notification id
        const id = currentNotifications[0];

        // Delete existing notification
        dispatch(handleRemoveLocalNotification(id));
      }

      // Add new notification for tomorrow
      dispatch(handleAddLocalNotification());
    }

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
                  <TextButton
                    color={'purple'}
                    onPress={this.retakeQuiz}
                  >
                    Retake Quiz
                  </TextButton>
                  <TextButton
                    onPress={() => { this.props.navigation.goBack() }}
                  >
                    Back to Deck
                  </TextButton>
                </View>
              </QuizScoreView>}
        </View>
      </ImageBackground>
    );
  }
}

function mapStateToProps({ localNotifications }) {
  return {
    localNotifications
  };
}

export default connect(mapStateToProps)(Quiz);