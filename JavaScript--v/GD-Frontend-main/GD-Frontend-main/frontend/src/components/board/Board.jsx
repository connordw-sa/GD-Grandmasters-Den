import React, { useState, useEffect } from "react";
import {
  assignSquareColors,
  initialBoardState,
  mapPiecesToBoard
} from "./utilities/boardMapper";
import { handleDrop, handleDragStart } from "./utilities/dropLogic";
import { useStore } from "../../zustand/store";
import moveSound from "../../assets/move.mp3";

const Board = ({ gameId, gameState }) => {
  const gameData = gameState;

  const coloredBoard = assignSquareColors(initialBoardState);
  const [chessBoard, setChessBoard] = useState(coloredBoard);
  const updateGameState = useStore((state) => state.updateCurrentGame);
  const currentUserId = useStore((state) => state.user?._id);
  const userColor = gameData?.player1._id === currentUserId ? "white" : "black";

  const playMoveSound = () => {
    const audio = new Audio(moveSound);
    audio.play();
  };

  useEffect(() => {
    async function fetchData() {
      const gameState = gameData;

      if (gameState) {
        const updatedBoard = mapPiecesToBoard(
          gameState.boardState,
          assignSquareColors(initialBoardState)
        );
        setChessBoard(updatedBoard);
      }
    }
    fetchData();
  }, [gameId, gameData]);

  return (
    <div>
      <div className={`board ${userColor === "black" ? "board-rotate" : ""}`}>
        {chessBoard.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="board-row d-flex">
            {row.map((square, squareIndex) => (
              <div
                key={`${square.position}-${squareIndex}`}
                id={square.position}
                className={`board-square ${square.color}  `}
                onDragOver={(event) => event.preventDefault()}
                onDrop={async (event) => {
                  playMoveSound();
                  const newGameState = await handleDrop(
                    event,
                    square,
                    chessBoard,
                    setChessBoard
                  );
                  const gameDataToUpdate = {
                    _id: gameId,
                    boardState: newGameState
                  };

                  updateGameState(gameDataToUpdate);
                }}
              >
                {square.piece && (
                  <img
                    key={`${square.piece.color}-${square.piece.type}`}
                    src={square.piece.image}
                    alt=""
                    className={`chess-piece ${square.piece.color} ${
                      square.piece.type
                    } ${userColor === "black" ? "chess-piece-rotate" : ""}`}
                    draggable={
                      gameId &&
                      gameData &&
                      ((currentUserId === gameData.player1._id &&
                        square.piece.color === "white") ||
                        (currentUserId === gameData.player2._id &&
                          square.piece.color === "black")) &&
                      currentUserId === gameData.currentPlayer._id
                    }
                    onDragStart={(event) => handleDragStart(event, square)}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
