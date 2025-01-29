import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { User } from '../models/User';
import { BoardCell, Position, Tile } from '../models/Tile';

const BOARD_SIZE = 15;
const INITIAL_TILES_COUNT = 7;
const AI_MOVE_DELAY = 1000;

const initializeBoard = (): BoardCell[][] => {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => ({ tile: null }))
  );
};

const createTilesBag = (): Tile[] => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return letters.split('').map((letter, index) => ({
    letter,
    value: 1 + Math.floor(index / 3),
    id: `${letter}-${Date.now()}-${Math.random()}`
  }));
};

const GameScreen = ({ route }: any) => {
  const { playWithAI = true } = route.params;
  const [board, setBoard] = useState(initializeBoard());
  const [players, setPlayers] = useState<User[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [tilesBag, setTilesBag] = useState<Tile[]>(createTilesBag());
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const newPlayers = [
      new User('Player 1'),
      playWithAI ? new User('AI', true) : new User('Player 2')
    ];

    newPlayers.forEach(player => {
      player.rack = tilesBag.slice(0, INITIAL_TILES_COUNT);
      player.score = 0;
    });

    setPlayers(newPlayers);
    setTilesBag(prev => prev.slice(INITIAL_TILES_COUNT));
  }, []);

  useEffect(() => {
    if (players[currentPlayerIndex]?.isAI && !gameOver) {
      setTimeout(makeAIMove, AI_MOVE_DELAY);
    }
  }, [currentPlayerIndex, players, gameOver]);

  const makeAIMove = () => {
    if (gameOver) return;

    const ai = players[currentPlayerIndex];
    if (!ai || !ai.rack.length) return;

    const wordLength = Math.min(ai.rack.length, 3);
    let placed = false;

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col <= BOARD_SIZE - wordLength; col++) {
        if (board[row].slice(col, col + wordLength).every(cell => !cell.tile)) {
          const wordTiles = ai.rack.slice(0, wordLength);
          const newBoard = board.map(row => [...row]);

          wordTiles.forEach((tile, i) => {
            newBoard[row][col + i].tile = tile;
          });

          setBoard(newBoard);
          setPlayers(prev => {
            const updated = [...prev];
            updated[currentPlayerIndex].rack = ai.rack.slice(wordLength);
            updated[currentPlayerIndex].score += wordTiles.reduce((sum, t) => sum + t.value, 0);
            return updated;
          });

          drawNewTiles();
          switchTurn();
          placed = true;
          return;
        }
      }
    }

    const validMoves = board.flatMap((row, rowIndex) =>
      row.map((cell, colIndex) => ({ row: rowIndex, col: colIndex }))
        .filter(pos => !board[pos.row][pos.col].tile)
    );

    if (validMoves.length > 0) {
      const position = validMoves[Math.floor(Math.random() * validMoves.length)];
      const tile = ai.rack[0];

      const newBoard = board.map(row => [...row]);
      newBoard[position.row][position.col].tile = tile;
      setBoard(newBoard);

      setPlayers(prevPlayers => {
        const newPlayers = [...prevPlayers];
        newPlayers[currentPlayerIndex].rack = ai.rack.slice(1);
        newPlayers[currentPlayerIndex].score += tile.value;
        return newPlayers;
      });

      drawNewTiles();
      switchTurn();
    }
  };

  const drawNewTiles = () => {
    setPlayers(prevPlayers => {
      const newPlayers = [...prevPlayers];
      const currentPlayer = newPlayers[currentPlayerIndex];

      while (currentPlayer.rack.length < INITIAL_TILES_COUNT && tilesBag.length > 0) {
        currentPlayer.rack.push(tilesBag[0]);
        setTilesBag(prevBag => prevBag.slice(1));
      }

      if (tilesBag.length === 0 && currentPlayer.rack.length === 0) {
        setGameOver(true);
        determineWinner();
      }

      return newPlayers;
    });
  };

  const determineWinner = () => {
    let maxScore = -Infinity;
    let winners: User[] = [];

    players.forEach(player => {
      if (player.score > maxScore) {
        maxScore = player.score;
        winners = [player];
      } else if (player.score === maxScore) {
        winners.push(player);
      }
    });

    if (winners.length === 1) {
      Alert.alert(`Game Over! Winner: ${winners[0].name}`, `Final Score: ${winners[0].score}`);
    } else {
      Alert.alert('Game Over! It\'s a tie!', `Score: ${maxScore}`);
    }
  };

  const switchTurn = () => {
    if (gameOver) return;
    setCurrentPlayerIndex(prev => (prev + 1) % players.length);
    setSelectedTile(null);
    setSelectedPosition(null);
  };

  const selectTile = (tile: Tile) => {
    if (gameOver) return;
    setSelectedTile(tile);
  };

  const selectPosition = (row: number, col: number) => {
    if (gameOver) return;
    if (!selectedTile) {
      Alert.alert('Select a tile first');
      return;
    }
    setSelectedPosition({ row, col });
  };

  const placeTile = () => {
    if (gameOver) return;
    if (!selectedTile || !selectedPosition) {
      Alert.alert('Select a tile and position first');
      return;
    }

    const { row, col } = selectedPosition;
    if (board[row][col].tile) {
      Alert.alert('Tile already placed here');
      return;
    }

    setBoard(prevBoard => {
      const newBoard = prevBoard.map(row => row.map(cell => ({ ...cell })));
      newBoard[row][col].tile = selectedTile;
      return newBoard;
    });

    setPlayers(prevPlayers => {
      const newPlayers = [...prevPlayers];
      const currentPlayer = newPlayers[currentPlayerIndex];
      currentPlayer.rack = currentPlayer.rack.filter(tile => tile.id !== selectedTile.id);
      currentPlayer.score += selectedTile.value;
      return newPlayers;
    });

    setSelectedTile(null);
    setSelectedPosition(null);
    drawNewTiles();
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreBoard}>
        {players.map((player, index) => (
          <View key={index} style={styles.scoreItem}>
            <Text style={[styles.scoreText, currentPlayerIndex === index && styles.currentPlayer]}>
              {player.name}: {player.score}
            </Text>
          </View>
        ))}
      </View>

      {gameOver ? (
        <View style={styles.gameOver}>
          <Text style={styles.gameOverText}>Game Over!</Text>
        </View>
      ) : (
        <>
          <Text>Current Player: {players[currentPlayerIndex]?.name}</Text>
          <View style={styles.board}>
            {board.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((cell, colIndex) => (
                  <TouchableOpacity
                    key={colIndex}
                    style={[
                      styles.cell,
                      selectedPosition?.row === rowIndex && selectedPosition?.col === colIndex && styles.selectedCell,
                    ]}
                    onPress={() => selectPosition(rowIndex, colIndex)}
                  >
                    {cell.tile ? (
                      <Text style={styles.tile}>{cell.tile.letter}</Text>
                    ) : (
                      <Text style={styles.multiplier}>{cell.multiplier || ''}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          <ScrollView horizontal style={styles.rack}>
            {players[currentPlayerIndex]?.rack.map((tile) => (
              <TouchableOpacity
                key={tile.id}
                style={[styles.rackTile, selectedTile?.id === tile.id && styles.selectedTile]}
                onPress={() => selectTile(tile)}
              >
                <Text>{tile.letter}</Text>
                <Text style={styles.tileValue}>{tile.value}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.button} onPress={placeTile}>
            <Text style={styles.buttonText}>Place Tile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={switchTurn}>
            <Text style={styles.buttonText}>End Turn</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  scoreBoard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  scoreItem: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  scoreText: {
    fontSize: 16,
  },
  currentPlayer: {
    fontWeight: 'bold',
    color: 'blue',
  },
  gameOver: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
  },
  board: { borderWidth: 1, marginVertical: 16 },
  row: { flexDirection: 'row' },
  cell: {
    width: 32,
    height: 32,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  selectedCell: {
    backgroundColor: 'lightblue',
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
    alignItems: 'center',
  },
  selectedTile: {
    borderWidth: 2,
    borderColor: 'blue',
  },
  tileValue: { fontSize: 10, position: 'absolute', bottom: 2, right: 2 },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16 },
});

export default GameScreen;