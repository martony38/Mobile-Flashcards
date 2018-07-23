import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  PanResponder,
  Text,
  View,
  Dimensions,
  Animated,
  Platform
} from 'react-native';
import styled, { css } from 'styled-components';
import TextButton from './TextButton';

const { width } = Dimensions.get('window');
const cardMargin = 15;
const cardWidth = width - 2 * cardMargin;

export const card = css`
  top: ${props => props.offset ? (- props.offset * 0.5) : 0}px;
  left: ${props => props.offset ? (- props.offset * 0.5) : 0}px;
  margin: ${props => props.small ? 5 : cardMargin}px;
  border-radius: 7px;
  border-width: 1px;
  border-color: rgb(188,130,78);
  background-color: #F4DBAA;
  padding: 10px;
  ${props => props.cardWidth && `height: ${(props.cardWidth * 3.5 / 2.5)}px;`}
  ${props => props.cardWidth && `width: ${props.cardWidth}px;`}
`

const QuizCard = styled(Animated.View)`
  ${card}
  box-shadow: 0 19px 38px rgba(0,0,0,0.4);
`

const CardFace = styled(Animated.View)`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 100%;
  height: 100%;
  justify-content: space-around;
  align-items: center;
`

export const CardText = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  padding-left: 20px;
  padding-right: 20px;
  text-align: center;
`

const CardHelp = styled(Text)`
  text-align: center;
`

const CardFront = ({ text, cardOpacity, showAnswer, ready }) => (
  <CardFace
    style={{ opacity: cardOpacity }}
  >
    <CardText>{text}</CardText>
    <View style={{ alignItems: 'center'}}>
      <TextButton
        color={'blue'}
        onPress={showAnswer}
        disabled={!ready}
      >
        Show Answer
      </TextButton>
      <CardHelp>Turn card by swiping to show answer</CardHelp>
    </View>
  </CardFace>
)

const CardBack = ({ text, cardOpacity, answerCorrect, answerIncorrect, ready }) => (
  <CardFace
    style={{ opacity: cardOpacity, transform: [{ scaleX: -1 }] }}
  >
    <CardText>{text}</CardText>
    {/*TODO: Reduce font sixe if text too long to fit on card */}
    <View>
      <TextButton
        color={'rgb(105,169,57)'}
        onPress={answerCorrect}
        disabled={!ready}
      >
        Correct
      </TextButton>
      <TextButton
        color={'#e62e00'}
        onPress={answerIncorrect}
        disabled={!ready}
      >
        Incorrect
      </TextButton>
    </View>
  </CardFace>
)

class Card extends Component {
  state = {
    gestureAngle: new Animated.Value(0),
    initialAngle: 0,
    ready: true,
    xPosition: new Animated.Value(0),
    showAnswer: false
  }

  componentDidUpdate(prevProps) {
    const { xPosition } = this.state;

    if (prevProps.card !== this.props.card) {

      this.setState({
        // Show the question side when a new card appears.
        showAnswer: false
      });

      // Slide in card from right of screen.
      Animated.spring(xPosition, {
        toValue: 0
      }).start();
    }
  }

  reset = (callback) => {
    const { xPosition, gestureAngle } = this.state;

    // Slide out card to left of screen.
    Animated.timing(xPosition, {
      toValue: - width
    }).start(() => {
      this.setState({
        initialAngle: 0
       })
      gestureAngle.setValue(0);
      callback();
    })
  }

  answerCorrect = () => {
    this.reset(this.props.answerCorrect);
  }

  answerIncorrect = () => {
    this.reset(this.props.answerIncorrect);
  }

  flipCard = () => {
    const { gestureAngle } = this.state;

    // Tell component animation is running
    this.setState({ ready: false });

    // Flip card clockwise.
    Animated.timing(gestureAngle, {
      duration: 1000,
      toValue: - cardWidth
    }).start(({ finished }) => {
      this.state.gestureAngle.setValue(0);
      this.setState((prevState) => {
        return {
          initialAngle: prevState.initialAngle - cardWidth,
          ready: finished,
          showAnswer: !prevState.showAnswer
        }
      });
    });
  }

  _panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onPanResponderGrant: (evt, gestureState) => {
      // Tell component animation is running
      this.setState({ ready: false });
    },
    onPanResponderMove: Animated.event([
      null,
      {dx: this.state.gestureAngle}
    ]),
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      const { gestureAngle } = this.state;

      if (gestureState.dx > (cardWidth / 2)) {
        // Flip card counterclockwise.
        Animated.spring(gestureAngle, {
          toValue: cardWidth
        }).start(({ finished }) => {
          this.state.gestureAngle.setValue(0);
          this.setState((prevState) => {
            return {
              initialAngle: prevState.initialAngle + cardWidth,
              ready: finished,
              showAnswer: !prevState.showAnswer
            }
          });
        });

      } else if (gestureState.dx < - (cardWidth / 2)) {
        // Flip card clockwise.
        Animated.spring(gestureAngle, {
          toValue: - cardWidth
        }).start(({ finished }) => {
          this.state.gestureAngle.setValue(0);
          this.setState((prevState) => {
            return {
              initialAngle: prevState.initialAngle - cardWidth,
              ready: finished,
              showAnswer: !prevState.showAnswer
            }
          });
        });
      } else {
        // Return card to initial position.
        Animated.spring(gestureAngle, {
          toValue: 0
        }).start(({ finished }) => {
          this.setState({ ready: finished });
        });
      }
    }
  })

  render() {
    const { question, answer, id } = this.props.card;
    const { gestureAngle, initialAngle, ready, xPosition, showAnswer } = this.state;

    const cardAngle = Animated.modulo(
      Animated.add(initialAngle, gestureAngle),
      2 * cardWidth
    ).interpolate({
      inputRange: [ - 2 * cardWidth, - cardWidth, 0, cardWidth, 2 * cardWidth],
      outputRange: [-360, -180, 0, 180, 360]
    });

    const newPosition = Animated.multiply(xPosition, -1);

    const cardFrontOpacity = cardAngle.interpolate({
      inputRange: [-360, -270, -269, -180, -90, -89, 0, 89, 90, 180, 269, 270, 360],
      outputRange: [1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1]
    })
    const cardBackOpacity = cardAngle.interpolate({
      inputRange: [-360, -270, -269, -180, -90, -89, 0, 89, 90, 180, 269, 270, 360],
      outputRange: [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0]
    })

    return (
      <QuizCard
        cardWidth={cardWidth}
        style={{
          transform: [
            { rotateY: cardAngle.interpolate({
              inputRange: [-360, -180, 0, 180, 360],
              outputRange: ['-360deg', '-180deg', '0deg', '180deg', '360deg']
            }) },
            { translateX: newPosition },
            Platform.OS === 'ios'
              ? { skewY: cardAngle.interpolate({
                  inputRange: [-360, -270, -180, -90, 0, 90, 180, 270, 360],
                  outputRange: ['0deg', '-20deg', '0deg', '20deg', '0deg', '-20deg', '0deg', '20deg', '0deg']
                  }) }
              : { skewY: '0deg' } // skew not working properly on Android (https://github.com/facebook/react-native/issues/12212)
          ]
        }}
        {...this._panResponder.panHandlers}
      >
        {(!ready || !showAnswer) && <CardFront
          cardOpacity={cardFrontOpacity}
          text={question}
          showAnswer={this.flipCard}
          ready={ready}
        />}
        {(!ready || showAnswer) && <CardBack
          cardOpacity={cardBackOpacity}
          text={answer}
          answerCorrect={this.answerCorrect}
          answerIncorrect={this.answerIncorrect}
          ready={ready}
        />}
      </QuizCard>
    );
  }
}

function mapStateToProps({ cards }, { id }) {
  const card = cards[id]

  return {
    card
  };
}

export default connect(mapStateToProps)(Card);
