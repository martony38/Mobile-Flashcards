import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  TouchableOpacity,
  Text,
  TextInput,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ImageBackground
} from 'react-native';
import styled from 'styled-components';
import { handleEditCard, handleRemoveCard } from '../actions/cards';
import TextButton from './TextButton';

const { width } = Dimensions.get('window');

export const SubmitButton = styled(TouchableOpacity)`
  background-color: black;
  border-radius: 30px;
  padding-top: 20px;
  padding-bottom: 20px;
  margin: 10px;
  align-items: center;
  width: ${width / 2}px;
  ${props => props.disabled && 'opacity: 0.2;'}
`

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

class EditCard extends Component {
  static navigationOptions = {
    title: 'Edit Card',
  };

  state = {
    question: this.props.card.question,
    answer: this.props.card.answer,
  }

  updateCard = () => {
    const { id } = this.props.card;

    this.props.dispatch(handleEditCard(id, this.state.question, this.state.answer));

    this.props.navigation.goBack();
  }

  deleteCard = () => {
    const { card: { id }, deckId } = this.props;

    this.props.dispatch(handleRemoveCard(deckId, id));

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
              placeholder='Enter question here...'
              value={question}
              onChangeText={(question) => this.setState({ question })}
            />
            <Text>Answer</Text>
            <NewCardInput
              multiline = {true}
              placeholder='Enter answer here...'
              value={answer}
              onChangeText={(answer) => this.setState({ answer })}
            />
            <TextButton
              color={'black'}
              disabled={question === '' || answer === ''}
              onPress={this.updateCard}
            >
              Update Card
            </TextButton>
            <TextButton
              color={'red'}
              onPress={this.deleteCard}
            >
              Delete Card
            </TextButton>
          </NewCardContainer>
        </ KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

function mapStateToProps({ cards }, { navigation }) {
  const card = cards[navigation.getParam('id')];
  const deckId = navigation.getParam('deckId')

  return {
    card,
    deckId
  };
}

export default connect(mapStateToProps)(EditCard);
