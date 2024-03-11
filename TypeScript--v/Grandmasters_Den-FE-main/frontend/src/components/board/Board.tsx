import BlackKing from "../../assets/pieces/b-king.png";
import BlackQueen from "../../assets/pieces/b-queen.png";
import BlackBishop from "../../assets/pieces/b-bishop.png";
import BlackKnight from "../../assets/pieces/b-knight.png";
import BlackRook from "../../assets/pieces/b-rook.png";
import BlackPawn from "../../assets/pieces/b-pawn.png";
import WhiteKing from "../../assets/pieces/w-king.png";
import WhiteQueen from "../../assets/pieces/w-queen.png";
import WhiteBishop from "../../assets/pieces/w-bishop.png";
import WhiteKnight from "../../assets/pieces/w-knight.png";
import WhiteRook from "../../assets/pieces/w-rook.png";
import WhitePawn from "../../assets/pieces/w-pawn.png";
import React from "react";
import { useStore, GameData } from "../../zustand/Store";
import { useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import {
  isDiagonalMove,
  isHorizontalMove,
  isVerticalMove,
  isMoveObstructed,
  isSameColorPiece
} from "./utility/GameLogic";
type PieceColor = "black" | "white";
type PieceType = "king" | "queen" | "bishop" | "knight" | "rook" | "pawn";

type ParamTypes = {
  gameId: string;
};

interface ChessBoardProps {
  gameState: GameData | null;
  socket: Socket | null;
  userColor: PieceColor;
  userId: string | undefined;
}

const ChessBoard: React.FC<ChessBoardProps> = ({
  gameState,
  socket,
  userColor,
  userId
}) => {
  const { gameId } = useParams<ParamTypes>();

  const updateCurrentGame = useStore((state) => state.updateCurrentGame);

  if (!gameState) return null;

  const { boardState } = gameState;

  const pieceImages: Record<PieceColor, Record<PieceType, string>> = {
    black: {
      king: BlackKing,
      queen: BlackQueen,
      bishop: BlackBishop,
      knight: BlackKnight,
      rook: BlackRook,
      pawn: BlackPawn
    },
    white: {
      king: WhiteKing,
      queen: WhiteQueen,
      bishop: WhiteBishop,
      knight: WhiteKnight,
      rook: WhiteRook,
      pawn: WhitePawn
    }
  };

  const chessRows = ["8", "7", "6", "5", "4", "3", "2", "1"];
  const chessColumns = ["a", "b", "c", "d", "e", "f", "g", "h"];

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const pieceId = event.dataTransfer.getData("application/reactflow");
    if (gameId && gameState && socket) {
      const newGameState = JSON.parse(JSON.stringify(gameState));
      const piece = newGameState.boardState.find(
        (p: { position: string }) => p.position === pieceId
      );
      const targetPosition = (event.currentTarget as HTMLElement).id;
      if (gameState.currentPlayer !== userId) return;

      if (piece) {
        if (piece.color !== userColor) return;
        console.log("usercolor:", userColor);

        const targetPieceIndex = newGameState.boardState.findIndex(
          (p: { position: string }) => p.position === targetPosition
        );
        if (targetPieceIndex >= 0) {
          newGameState.boardState.splice(targetPieceIndex, 1);
        }

        piece.position = targetPosition;

        socket.emit("move", gameId, newGameState);
        updateCurrentGame(newGameState);
      }
    }
  };

  return (
    <div className="chessboard">
      {chessRows.map((row, i) =>
        chessColumns.map((column, j) => {
          const position = `${column}${row}`;
          const piece = boardState.find((p) => p.position === position);
          const squareColor =
            (i + j) % 2 === 0 ? "white-square" : "black-square";

          return (
            <div
              key={position}
              id={position}
              className={`board-square ${squareColor}`}
              onDragOver={(event) => {
                event.preventDefault();
              }}
              onDrop={handleDrop}
            >
              {piece && (
                <img
                  src={pieceImages[piece.color][piece.type]}
                  alt={piece.type}
                  className={`chess-piece ${piece.color}-${piece.type}`}
                  draggable="true"
                  onDragStart={(event) => {
                    event.dataTransfer.setData(
                      "application/reactflow",
                      piece.position
                    );
                  }}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ChessBoard;
