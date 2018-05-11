import React, { Component } from 'react';
import { connect } from "react-redux";
import { TouchableOpacity, Text, TextInput, View } from 'react-native';
import { handleAddCard } from '../actions/cards';

class NewCard extends Component {
  state = {
    question: '',
    answer: ''
  }

  createCard = () => {
    const deckId = this.props.navigation.getParam('id');

    this.props.dispatch(handleAddCard(deckId, this.state.question, this.state.answer));

    this.setState({
      question: '',
      answer: ''
    });

    this.props.navigation.goBack();
  }

  render() {
    const { question, answer } = this.state;

    return (
      <View>
        <TextInput
          placeholder="Question"
          value={question}
          onChangeText={(question) => this.setState({ question })}
        />
        <TextInput
          placeholder="Answer"
          value={answer}
          onChangeText={(answer) => this.setState({ answer })}
        />
        <TouchableOpacity
          disabled={question === '' || answer === ''}
          onPress={this.createCard}
        >
          <Text>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default connect()(NewCard);
