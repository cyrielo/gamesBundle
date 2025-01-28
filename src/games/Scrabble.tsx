import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { User } from '../models/User';
import { BoardCell, Position, Tile } from '../models/Tile';

const BOARD_SIZE = 15;
const INITIAL_TILES_COUNT = 7;

// Initialize board with multipliers
const initializeBoard = (): BoardCell[][] => {
  const board = Array(BOARD_SIZE).fill(null).map(() =>
    Array(BOARD_SIZE).fill({ tile: null }));
  // Add center star
  board[7][7].multiplier = 'DW';
  return board;
};

const createTilesBag = (): Tile[] => {
  // Simplified tile distribution
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return letters.split('').map((letter, index) => ({
    letter,
    value: 1 + Math.floor(index / 3),
    id: `${letter}-${Date.now()}-${Math.random()}`
  }));
};

const GameScreen = ({ route }: any) => {
  const { playWithAI } = route.params;
  const [board, setBoard] = useState(initializeBoard());
  const [players, setPlayers] = useState<User[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [tilesBag, setTilesBag] = useState<Tile[]>(createTilesBag());

  useEffect(() => {
    const initialPlayers = [
      new User('Player 1'),
      playWithAI ? new User('AI', true) : new User('Player 2')
    ];

    initialPlayers.forEach(player => {
      player.rack = tilesBag.splice(0, INITIAL_TILES_COUNT);
    });

    setPlayers(initialPlayers);
  }, []);

  useEffect(() => {
    if (players[currentPlayerIndex]?.isAI) {
      setTimeout(makeAIMove, 1000);
    }
  }, [currentPlayerIndex]);

  const makeAIMove = () => {
    const ai = players[currentPlayerIndex];
    const validMoves: Position[] = [];

    // Find all empty positions
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (!cell.tile) validMoves.push({ row: rowIndex, col: colIndex });
      });
    });

    if (validMoves.length > 0 && ai.rack.length > 0) {
      const randomPosition = validMoves[Math.floor(Math.random() * validMoves.length)];
      const randomTile = ai.rack[0];

      const newBoard = [...board];
      newBoard[randomPosition.row][randomPosition.col].tile = randomTile;
      setBoard(newBoard);

      const newPlayers = [...players];
      newPlayers[currentPlayerIndex].rack = ai.rack.slice(1);
      setPlayers(newPlayers);

      drawNewTiles();
      switchTurn();
    }
  };

  const drawNewTiles = () => {
    const newPlayers = [...players];
    const currentPlayer = newPlayers[currentPlayerIndex];

    while (currentPlayer.rack.length < INITIAL_TILES_COUNT && tilesBag.length > 0) {
      currentPlayer.rack.push(tilesBag.pop()!);
    }

    setPlayers(newPlayers);
    setTilesBag([...tilesBag]);
  };

  const switchTurn = () => {
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
  };

  return (
    <View style={styles.container}>
      <Text>Current Player: {players[currentPlayerIndex]?.name}</Text>
      <View style={styles.board}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <View key={colIndex} style={styles.cell}>
                {cell.tile ? (
                  <Text style={styles.tile}>{cell.tile.letter}</Text>
                ) : (
                  <Text style={styles.multiplier}>{cell.multiplier}</Text>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
      <ScrollView horizontal style={styles.rack}>
        {players[currentPlayerIndex]?.rack.map((tile) => (
          <View key={tile.id} style={styles.rackTile}>
            <Text>{tile.letter}</Text>
            <Text style={styles.tileValue}>{tile.value}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  board: { borderWidth: 1, marginVertical: 16 },
  row: { flexDirection: 'row' },
  cell: {
    width: 24,
    height: 24,
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tile: { fontSize: 18 },
  multiplier: { fontSize: 8, color: 'gray' },
  rack: { height: 60, marginVertical: 16 },
  rackTile: {
    width: 40,
    height: 40,
    backgroundColor: 'tan',
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tileValue: {
    fontSize: 10,
    position: 'absolute',
    bottom: 2,
    right: 2
  }
});

export default GameScreen;
