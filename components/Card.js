import React, { Component } from 'react';
import { connect } from "react-redux";
import { PanResponder, TouchableOpacity, Text, View, Dimensions, Animated } from 'react-native';
import styled, { css } from 'styled-components';

const { width } = Dimensions.get('window');

export const card = css`
  top: ${props => props.offset ? (- props.offset * 0.5) : 0}px;
  left: ${props => props.offset ? (- props.offset * 0.5) : 0}px;
  margin: 15px;
  border-radius: 7px;
  border-width: 1px;
  border-color: rgb(188,130,78);
  background-color: #F4DBAA;
  padding: 10px;
  ${props => props.width && `height: ${(props.width * 3.5 / 2.5)}px;`}
  ${props => props.width && `width: ${props.width}px;`}
`

const StyledCard = styled(Animated.View)`
  ${card}
  box-shadow: 0 19px 38px rgba(0,0,0,0.4);
  /* box-shadow: 0 1px 1px rgba(0,0,0,0.2); */
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

export const CardButton = styled(TouchableOpacity)`
  background-color: ${props => props.correct ? '#29a329' : '#e62e00'};
  border-radius: 30px;
  padding-top: 20px;
  padding-bottom: 20px;
  margin: 10px;
  align-items: center;
  width: ${width / 2}px;
`

export const ButtonText = styled(Text)`
  color: white;
  font-size: 18px;
  font-weight: bold;
`

export const CardText = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  padding-left: 20px;
  padding-right: 20px;
`

const CardFront = ({ text, opacity }) => (
  <CardFace
    style={{ opacity }}
  >
    <CardText>{text}</CardText>
    <Text>Turn card to show answer</Text>
  </CardFace>
)

const CardBack = ({ text, opacity, answerCorrect, answerIncorrect, ready }) => (
  <CardFace
    style={{ opacity, transform: [{rotateY: '180deg'}] }}
  >
    <CardText>{text}</CardText>
    <View>
      <CardButton
        correct
        onPress={answerCorrect}
        disabled={!ready}
      >
        <ButtonText>Correct</ButtonText>
      </CardButton>
      <CardButton
        onPress={answerIncorrect}
        disabled={!ready}
      >
        <ButtonText>Incorrect</ButtonText>
      </CardButton>
    </View>
  </CardFace>
)

class Card extends Component {
  state = {
    gestureAngle: new Animated.Value(0),
    initialAngle: 0,
    ready: true,
    xPosition: new Animated.Value(0),
    newCard: true
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps, prevState) {
    const { xPosition } = this.state;

    if (prevProps.card !== this.props.card) {
      Animated.spring(xPosition, {
        toValue: 0
      }).start()
    }
  }

  reset = (callback) => {
    const { xPosition, gestureAngle } = this.state;

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

  _panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onPanResponderGrant: (evt, gestureState) => {
      this.setState({ ready: false })
    },
    onPanResponderMove: Animated.event([
      null,
      {dx: this.state.gestureAngle}
    ]),
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      const { width } = Dimensions.get('window');
      const { gestureAngle, initialAngle } = this.state;

      if (gestureState.dx > ((width - 30) / 2)) {
        // Flip card.
        Animated.spring(gestureAngle, {
          toValue: width - 30
        }).start(() => {
          this.state.gestureAngle.setValue(0);
          this.setState((prevState) => {
            return {
              initialAngle: prevState.initialAngle + width - 30,
              ready: true
            }
          });
        });

      } else if (gestureState.dx < - ((width - 30) / 2)) {
        // Flip card.
        Animated.spring(gestureAngle, {
          toValue: 30 - width
        }).start(() => {
          this.state.gestureAngle.setValue(0);
          this.setState((prevState) => {
            return {
              initialAngle: prevState.initialAngle + 30 - width,
              ready: true
            }
          });
        });
      } else {
        // Return card to initial position.
        Animated.spring(gestureAngle, {
          toValue: 0
        }).start(() => {
          this.setState({ ready: true });
        });
      }
    }
  })

  render() {
    const { question, answer } = this.props.card;
    const { gestureAngle, initialAngle, ready, xPosition, newCard } = this.state;
    const { width } = Dimensions.get('window');

    const cardAngle = Animated.modulo(
      Animated.add(initialAngle, gestureAngle),
      2 * (width - 30)
    ).interpolate({
      inputRange: [2 * (30 - width), 30 - width, 0, width - 30, 2 * (width - 30)],
      outputRange: [-360, -180, 0, 180, 360]
    });

    const newPosition = Animated.multiply(xPosition, -1);

    return (
      <StyledCard
        width={width - 30}
        style={{
          transform: [
            { rotateY: cardAngle.interpolate({
              inputRange: [-360, -180, 0, 180, 360],
              outputRange: ['-360deg', '-180deg', '0deg', '180deg', '360deg']
            }) },
            { perspective: 100 }, // without this line this Animation will not render on Android while working fine on iOS
            { translateX: newPosition },
            { skewY: cardAngle.interpolate({
              inputRange: [-360, -270, -180, -90, 0, 90, 180, 270, 360],
              outputRange: ['0deg', '-20deg', '0deg', '20deg', '0deg', '-20deg', '0deg', '20deg', '0deg']
            }) }
          ]
        }}
        {...this._panResponder.panHandlers}
      >
        <CardFront
          width={width - 30}
          opacity={cardAngle.interpolate({
            inputRange: [-360, -270, -269, -180, -90, -89, 0, 89, 90, 180, 269, 270, 360],
            outputRange: [1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1]
          })}
          text={question}
        />
        <CardBack
          width={width - 30}
          opacity={cardAngle.interpolate({
            inputRange: [-360, -270, -269, -180, -90, -89, 0, 89, 90, 180, 269, 270, 360],
            outputRange: [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0]
          })}
          text={answer}
          answerCorrect={this.answerCorrect}
          answerIncorrect={this.answerIncorrect}
          ready={ready}
        />
      </StyledCard>
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
