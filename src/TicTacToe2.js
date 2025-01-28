import React, { useState } from "react";
import { View, Text, TouchableOpacity, Button, StyleSheet } from "react-native";

const Player = (symbol) => {
  return { symbol };
};

const EasyAI = (symbol) => {
  return {
    symbol,
    makeMove: (board) => {
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) return i;
      }
      return -1;
    },
  };
};

const MediumAI = (symbol) => {
  return {
    symbol,
    makeMove: (board) => {
      const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];

      for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] === symbol && board[b] === symbol && board[c] === null) return c;
        if (board[a] === symbol && board[c] === symbol && board[b] === null) return b;
        if (board[b] === symbol && board[c] === symbol && board[a] === null) return a;
      }

      const emptySpots = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
      return emptySpots.length > 0 ? emptySpots[Math.floor(Math.random() * emptySpots.length)] : -1;
    },
  };
};

const HardAI = (symbol) => {
  return {
    symbol,
    makeMove: (board) => {
      const opponent = symbol === "X" ? "O" : "X";

      const minimax = (board, isMaximizing) => {
        const winner = checkWinner(board);
        if (winner === symbol) return 10;
        if (winner === opponent) return -10;
        if (!board.includes(null)) return 0;

        let bestScore = isMaximizing ? -Infinity : Infinity;
        for (let i = 0; i < board.length; i++) {
          if (board[i] === null) {
            board[i] = isMaximizing ? symbol : opponent;
            let score = minimax(board, !isMaximizing);
            board[i] = null;
            bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
          }
        }
        return bestScore;
      };

      let bestMove = -1;
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = symbol;
          let score = minimax(board, false);
          board[i] = null;
          if (score > bestScore) {
            bestScore = score;
            bestMove = i;
          }
        }
      }
      return bestMove;
    },
  };
};

const checkWinner = (board) => {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.includes(null) ? null : "Draw";
};

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player1] = useState(Player("X"));
  const [player2, setPlayer2] = useState(Player("O"));
  const [currentPlayer, setCurrentPlayer] = useState(player1);
  const [isAI, setIsAI] = useState(false);
  const [aiType, setAiType] = useState(null);
  const [winner, setWinner] = useState(null);

  const handlePress = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer.symbol;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
      return;
    }

    const nextPlayer = currentPlayer === player1 ? player2 : player1;
    setCurrentPlayer(nextPlayer);

    if (isAI && nextPlayer.symbol === "O") {
      setTimeout(() => {
        const aiMove = player2.makeMove([...newBoard]);
        if (aiMove !== -1) {
          newBoard[aiMove] = player2.symbol;
          setBoard(newBoard);
          const aiResult = checkWinner(newBoard);
          if (aiResult) setWinner(aiResult);
          setCurrentPlayer(player1);
        }
      }, 500);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setCurrentPlayer(player1);
  };

  const enableAI = (difficulty) => {
    const ai = difficulty === "medium" ? MediumAI("O") : difficulty === "hard" ? HardAI("O") : EasyAI("O");
    setPlayer2(ai);
    setAiType(difficulty);
    setIsAI(true);
    resetGame();
  };

  return (
    <View style={styles.container}>
      <Button title="Play with Easy AI" onPress={() => enableAI("easy")} />
      <Button title="Play with Medium AI" onPress={() => enableAI("medium")} />
      <Button title="Play with Hard AI" onPress={() => enableAI("hard")} />
      {isAI && <Text>Playing against {aiType} AI</Text>}
      <View style={styles.board}>
        {board.map((cell, index) => (
          <TouchableOpacity key={index} style={styles.cell} onPress={() => handlePress(index)}>
            <Text style={styles.cellText}>{cell}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {winner && <Text>{winner === "Draw" ? "It's a Draw!" : `${winner} Wins!`}</Text>}
      <Button title="Restart" onPress={resetGame} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  board: { flexDirection: "row", flexWrap: "wrap", width: 300 },
  cell: { width: 100, height: 100, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  cellText: { fontSize: 24, fontWeight: "bold" },
  winnerText: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
});


export default TicTacToe;
