import {
  isLegalMove,
  isKingAttacked,
  isCheckmate,
  makeMove,
  findSquare,
  promotePawnToQueen
} from "./pieceMoves";
import { isSameColorPiece } from "./moveHelpers";

export const handleDragStart = (event, square) => {
  event.dataTransfer.setData("text/plain", JSON.stringify(square));
};

const isSameSquare = (sourceSquare, destinationSquare) =>
  sourceSquare.position === destinationSquare.position;

const isPromotablePawn = (sourceSquare, destinationSquare) =>
  sourceSquare.piece.type === "pawn" &&
  ((sourceSquare.piece.color === "white" &&
    destinationSquare.position[1] === "8") ||
    (sourceSquare.piece.color === "black" &&
      destinationSquare.position[1] === "1"));

const isCastlingMove = (sourceSquare, destinationSquare) =>
  sourceSquare.piece.type === "king" &&
  Math.abs(
    destinationSquare.position.charCodeAt(0) -
      sourceSquare.position.charCodeAt(0)
  ) === 2;

const getRookPositions = (sourceSquare, destinationSquare) => {
  const rookSourceColumn =
    destinationSquare.position[0] < sourceSquare.position[0] ? "a" : "h";
  const rookDestColumn =
    destinationSquare.position[0] < sourceSquare.position[0] ? "d" : "f";
  const rookRow = sourceSquare.position[1];

  return {
    rookSourcePos: `${rookSourceColumn}${rookRow}`,
    rookDestPos: `${rookDestColumn}${rookRow}`
  };
};

export async function handleDrop(
  event,
  destinationSquare,
  chessBoard,
  setChessBoard,
  updateGameState
) {
  event.preventDefault();
  const sourceSquare = JSON.parse(event.dataTransfer.getData("text/plain"));

  if (isSameSquare(sourceSquare, destinationSquare)) {
    console.log("Same Square");
    return;
  }

  if (isSameColorPiece(sourceSquare, destinationSquare)) {
    console.log("Same color piece");
    return;
  }

  if (
    !isLegalMove(
      sourceSquare,
      destinationSquare,
      chessBoard,
      sourceSquare.piece.type
    )
  ) {
    console.log("not legal move");
    return;
  }

  let tempBoard = makeMove(sourceSquare, destinationSquare, chessBoard);

  const movingKingColor = sourceSquare.piece.color;
  const opponentColor = movingKingColor === "white" ? "black" : "white";

  if (isPromotablePawn(sourceSquare, destinationSquare)) {
    tempBoard = promotePawnToQueen(tempBoard, sourceSquare, destinationSquare);
  }

  if (isKingAttacked(movingKingColor, tempBoard)) {
    alert("King is still in check!");
    return;
  } else {
    if (isKingAttacked(opponentColor, tempBoard)) {
      if (isCheckmate(opponentColor, tempBoard)) {
        alert("checkmate ");
      } else {
        alert("this is normal check, because the king can get out of it");
      }
    }
  }

  if (isCastlingMove(sourceSquare, destinationSquare)) {
    const { rookSourcePos, rookDestPos } = getRookPositions(
      sourceSquare,
      destinationSquare
    );

    tempBoard = makeMove(
      findSquare(chessBoard, rookSourcePos),
      findSquare(chessBoard, rookDestPos),
      tempBoard
    );
  }

  await setChessBoard(tempBoard);

  isKingAttacked(
    sourceSquare.piece.color === "white" ? "black" : "white",
    tempBoard
  );

  const PIECE_COLORS = /(white|black)/;
  const PIECE_TYPES = /(pawn|rook|knight|bishop|queen|king)/;

  const extractPieceDetails = (imgClass) => {
    const color = imgClass.match(PIECE_COLORS)?.[0] || "";
    const type = imgClass.match(PIECE_TYPES)?.[0] || "";

    return { color, type };
  };

  const findChessPiece = (squarePosition) => {
    const squareElement = document.getElementById(squarePosition);
    return squareElement.querySelector("img.chess-piece");
  };

  const formatBoardState = (board) => {
    return board.flatMap((row) =>
      row
        .map((square) => {
          const chessPieceImg = findChessPiece(square.position);

          if (!chessPieceImg) {
            return null;
          }

          const { color, type } = extractPieceDetails(
            chessPieceImg.getAttribute("class")
          );

          if (!color || !type) {
            console.error(
              `Error: missing color or type for ${square.position}`
            );
            return null;
          }

          return { position: square.position, color, type };
        })
        .filter((square) => square !== null)
    );
  };

  console.log("sourceSquare:", sourceSquare);
  console.log("destinationSquare:", destinationSquare);
  const newGameState = formatBoardState(tempBoard);

  return newGameState;
}
