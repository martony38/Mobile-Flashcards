import React, { Component } from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components';

const StyledLoadingScreen = styled(View)`
  background-color: rgb(105,169,57);
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 40px;
`

const LoadingScreenText = styled(Text)`
  color: white;
  font-size: 36px;
  font-weight: bold;
  text-align: center;
`

export default class LoadingScreen extends Component {
  render() {
    return (
      <StyledLoadingScreen>
        <LoadingScreenText>MOBILE FLASHCARDS</LoadingScreenText>
      </StyledLoadingScreen>
    );
  }
}