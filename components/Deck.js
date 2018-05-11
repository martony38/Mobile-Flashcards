import React, { Component } from 'react';
import { connect } from "react-redux";
import { TouchableOpacity, Text, View } from 'react-native';

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
    const { title, cards } = this.props.deck;

    this.props.navigation.navigate(
      'Quiz',
      { title, cards }
    )
  }

  render() {
    const { deck } = this.props;

    return (
      <View>
        <Text>{deck.title}</Text>
        <Text>{deck.cards.length} cards</Text>
        <TouchableOpacity
          onPress={this.addCard}
        >
          <Text>Add Card</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.startQuiz}
        >
          <Text>Start Quiz</Text>
        </TouchableOpacity>
      </View>
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
