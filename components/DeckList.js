import React, { Component } from 'react';
import { connect } from "react-redux";
import { FlatList, Text, View, TouchableOpacity } from 'react-native';

class DeckList extends Component {
  renderDeck = ({ item }) => (
    <View>
      <TouchableOpacity
          onPress={() => this.props.navigation.navigate(
            'Deck',
            { title: item.title, id: item.id }
          )}
        >
        <Text>{item.title}</Text>
        <Text>{`${item.cards.length} card${item.cards.length === 1 ? '' : 's'}`}</Text>
      </TouchableOpacity>
    </View>
  )

  render() {
    const { decks } = this.props;
    return (
      <View>
        {Object.keys(decks).length === 0
          ? <View>
              <Text>You do not have any deck.</Text>
            </View>
          : <View>
              <FlatList
                data={decks}
                renderItem={this.renderDeck}
                keyExtractor={(deck) => deck.id}
              />
            </View>}
      </View>
    );
  }
}

function mapStateToProps({ decks }) {
  return {
    decks: Object.keys(decks).map((key) => decks[key])
  };
}

export default connect(mapStateToProps)(DeckList);