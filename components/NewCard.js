import React, { Component } from 'react';
import { connect } from "react-redux";
import {
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ImageBackground
} from 'react-native';
import styled from 'styled-components';
import { handleAddCard } from '../actions/cards';
import TextButton from "./TextButton";

const NewCardContainer = styled(ScrollView)`
  padding: 40px;
`

export const NewCardInput = styled(TextInput)`
  border-radius: 5px;
  border-width: 1px;
  border-style: solid;
  border-color: black;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #F4DBAA;
`

class NewCard extends Component {
  static navigationOptions = {
    title: 'Add Card',
  };

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
      <ImageBackground style={{flex: 1}} source={require('../img/wood-background.jpg')}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <NewCardContainer
            contentContainerStyle={{
              alignItems: 'center'
            }}
            keyboardDismissMode='interactive'
          >
            <Text>Question</Text>
            <NewCardInput
              autoFocus
              multiline = {true}
              placeholder="Enter question here..."
              value={question}
              onChangeText={(question) => this.setState({ question })}
            />
            <Text>Answer</Text>
            <NewCardInput
              multiline = {true}
              placeholder="Enter answer here..."
              value={answer}
              onChangeText={(answer) => this.setState({ answer })}
            />
            <TextButton
              disabled={question === '' || answer === ''}
              onPress={this.createCard}
              color='black'
            >
              Create Card
            </TextButton>
          </NewCardContainer>
        </ KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

export default connect()(NewCard);
