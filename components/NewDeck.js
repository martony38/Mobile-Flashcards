import React, { Component } from 'react';
import { connect } from "react-redux";
import { TouchableOpacity, Text, TextInput, View } from 'react-native';
import { handleAddDeck } from "../actions/decks";

class NewDeck extends Component {
  state = {
    text: ''
  }

  createDeck = () => {
    this.props.dispatch(handleAddDeck(this.state.text));

    this.setState({ text: '' });

    this.props.navigation.goBack();
  }

  render() {
    const { text } = this.state;

    return (
      <View>
        <Text>What is the title of your new deck</Text>
        <TextInput
          placeholder="Deck Title"
          value={text}
          onChangeText={(text) => this.setState({ text })}
        />
        <TouchableOpacity
          disabled={text === ''}
          onPress={this.createDeck}
        >
          <Text>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default connect()(NewDeck);
