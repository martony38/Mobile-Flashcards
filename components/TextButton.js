import React from 'react';
import { Text, TouchableOpacity, Dimensions } from 'react-native';
import styled from 'styled-components';

const { width } = Dimensions.get('window');

const CardButton = styled(TouchableOpacity)`
  background-color: ${props => props.color};
  border-radius: 30px;
  padding-top: 20px;
  padding-bottom: 20px;
  margin: 10px;
  align-items: center;
  width: ${width / 2}px;
  ${props => props.disabled && 'opacity: 0.2;'}
`

const ButtonText = styled(Text)`
  color: white;
  font-size: 18px;
  font-weight: bold;
`

export default function TextButton({ children, color = 'black', onPress, disabled }) {
  return (
    <CardButton
      color={color}
      onPress={onPress}
      disabled={disabled}
    >
      <ButtonText>{children}</ButtonText>
    </CardButton>
  );
}


