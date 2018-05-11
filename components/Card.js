import React, { Component } from 'react';
import { connect } from "react-redux";
import { TouchableOpacity, Text, View } from 'react-native';

class Card extends Component {
  state = {
    showAnswer: false
  }

  reset = () => {
    this.setState({ showAnswer: false })
  }

  render() {
    const { question, answer } = this.props.card;
    const { showAnswer } = this.state;

    return (
      <View>
        <Text>{showAnswer? answer : question}</Text>
        <TouchableOpacity
          onPress={() => this.setState({ showAnswer: !showAnswer })}
        >
          <Text>{showAnswer ? 'Show Question' : 'Show Answer'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.reset();
            this.props.answerCorrect();
          }}
        >
          <Text>Correct</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.reset();
            this.props.answerIncorrect();
          }}
        >
          <Text>Incorrect</Text>
        </TouchableOpacity>
      </View>
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
