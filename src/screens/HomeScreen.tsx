import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }:any) => (
  <View style={styles.container}>
    <Button
      title="Play with AI"
      onPress={() => navigation.navigate('Game', { playWithAI: true })}
    />
    <Button
      title="2 Player Game"
      onPress={() => navigation.navigate('Game', { playWithAI: false })}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default HomeScreen;
