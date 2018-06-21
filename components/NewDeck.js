import React, { Component } from 'react';
import { connect } from "react-redux";
import {
  TouchableOpacity,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground
} from 'react-native';
import styled from 'styled-components';
import { handleAddDeck } from "../actions/decks";
import { SubmitButton } from "./NewCard";
import { ButtonText } from "./Card";

const NewDeckInput = styled(TextInput)`
border-radius: 5px;
border-width: 1px;
border-style: solid;
border-color: black;
width: 100%;
padding: 10px;
margin-bottom: 10px;
background-color: #F4DBAA;
`

const NewDeckContainer = styled(ScrollView)`
  padding: 40px;
`

class NewDeck extends Component {
  state = {
    text: ''
  }

  createDeck = () => {
    const title = this.state.text;

    this.setState({ text: '' });

    this.props.dispatch(handleAddDeck(title))
      .then((id) => {
        this.props.navigation.navigate(
          'Deck',
          { title, id}
        )
      });
  }

  render() {
    const { text } = this.state;

    return (
      <ImageBackground style={{flex: 1}} source={require('../img/wood-background.jpg')}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <NewDeckContainer
            contentContainerStyle={{
              alignItems: 'center'
            }}
            keyboardDismissMode='interactive'
          >
            <NewDeckInput
              autoFocus
              multiline = {true}
              placeholder="Enter the title of your new deck..."
              value={text}
              onChangeText={(text) => this.setState({ text })}
            />
            <SubmitButton
              disabled={text === ''}
              onPress={this.createDeck}
            >
              <ButtonText>Create Deck</ButtonText>
            </SubmitButton>
          </NewDeckContainer>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

export default connect()(NewDeck);
