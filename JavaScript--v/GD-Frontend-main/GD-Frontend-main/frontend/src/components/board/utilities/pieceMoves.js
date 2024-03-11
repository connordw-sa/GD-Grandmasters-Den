import {
  isVerticalMove,
  isDiagonalMove,
  isHorizontalMove,
  isMoveObstructed
} from "./moveHelpers";

import WhiteQueen from "../../../assets/pieces/w-queen.png";
import BlackQueen from "../../../assets/pieces/b-queen.png";

// PAWN LOGIC -----------------------------------------------------------------------

export const legalPawnMove = (sourceSquare, destinationSquare, chessBoard) => {
  const sourceRow = parseInt(sourceSquare.position[1]);
  const destinationRow = parseInt(destinationSquare.position[1]);
  const sourceColumn = sourceSquare.position[0];
  const destinationColumn = destinationSquare.position[0];
  const isWhite = sourceSquare.piece.color === "white";

  const direction = isWhite ? 1 : -1;
  const moveDistance = destinationRow - sourceRow;

  const isFirstMove =
    (isWhite && sourceRow === 2) || (!isWhite && sourceRow === 7);
  const isForwardOneSquare = moveDistance === direction;
  const isForwardTwoSquares = moveDistance === 2 * direction;
  const isVerticalOneOrTwoSquares =
    isForwardOneSquare || (isFirstMove && isForwardTwoSquares);

  const isSameColumn = sourceColumn === destinationColumn;
  const isDiagonalCapture =
    Math.abs(sourceColumn.charCodeAt(0) - destinationColumn.charCodeAt(0)) ===
      1 &&
    moveDistance === direction &&
    destinationSquare.piece;

  if (
    (isSameColumn && isVerticalOneOrTwoSquares && !destinationSquare.piece) ||
    isDiagonalCapture
  ) {
    if (
      !isMoveObstructed(
        sourceSquare,
        destinationSquare,
        chessBoard,
        isVerticalOneOrTwoSquares ? "vertical" : "diagonal"
      )
    ) {
      return true;
    }
  }

  return false;
};

// ROOK LOGIC -----------------------------------------------------------------------

const legalRookMove = (sourceSquare, destinationSquare, chessBoard) => {
  const sourcePosition = sourceSquare.position;
  const destinationPosition = destinationSquare.position;
  const isVertical = isVerticalMove(sourcePosition, destinationPosition);
  const isHorizontal = isHorizontalMove(sourcePosition, destinationPosition);

  if (!(isVertical || isHorizontal)) {
    return false;
  }

  const direction = isVertical ? "vertical" : "horizontal";

  if (
    isMoveObstructed(sourceSquare, destinationSquare, chessBoard, direction)
  ) {
    return false;
  }

  return true;
};

// KNIGHT LOGIC -----------------------------------------------------------------------

const legalKnightMove = (sourceSquare, destinationSquare) => {
  const sourceRow = parseInt(sourceSquare.position[1]);
  const sourceColumn = sourceSquare.position[0].charCodeAt(0);
  const destinationRow = parseInt(destinationSquare.position[1]);
  const destinationColumn = destinationSquare.position[0].charCodeAt(0);

  const rowDifference = Math.abs(destinationRow - sourceRow);
  const columnDifference = Math.abs(destinationColumn - sourceColumn);

  return (
    (rowDifference === 2 && columnDifference === 1) ||
    (rowDifference === 1 && columnDifference === 2)
  );
};

// BISHOP LOGIC -----------------------------------------------------------------------

const legalBishopMove = (sourceSquare, destinationSquare, chessBoard) => {
  if (isDiagonalMove(sourceSquare, destinationSquare)) {
    if (
      !isMoveObstructed(sourceSquare, destinationSquare, chessBoard, "diagonal")
    ) {
      return true;
    }
  }

  return false;
};

// QUEEN LOGIC -----------------------------------------------------------------------

const legalQueenMove = (sourceSquare, destinationSquare, chessBoard) => {
  if (
    legalRookMove(sourceSquare, destinationSquare, chessBoard) ||
    legalBishopMove(sourceSquare, destinationSquare, chessBoard)
  ) {
    return true;
  }

  return false;
};

/*
---------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------
// HELPER FUNCTIONS -------------------------------------------------------------------------------------------------------
*/

export const promotePawnToQueen = (
  chessBoard,
  sourceSquare,
  destinationSquare
) => {
  const newBoard = chessBoard.map((row) =>
    row.map((square) => {
      if (square.position === destinationSquare.position) {
        return {
          ...square,
          piece: {
            type: "queen",
            color: sourceSquare.piece.color,
            image:
              sourceSquare.piece.color === "white" ? WhiteQueen : BlackQueen
          }
        };
      }
      return square;
    })
  );
  return newBoard;
};

export const findSquare = (chessBoard, position) => {
  for (const row of chessBoard) {
    for (const square of row) {
      if (square.position === position) {
        return square;
      }
    }
  }
  return null;
};

export const makeMove = (sourceSquare, destinationSquare, board) => {
  return board.map((row) =>
    row.map((square) => {
      if (square.position === sourceSquare.position) {
        return { ...square, piece: null };
      }
      if (square.position === destinationSquare.position) {
        const updatedPiece = {
          ...sourceSquare.piece,
          hasMoved:
            sourceSquare.piece.type === "king" ||
            sourceSquare.piece.type === "rook"
              ? true
              : sourceSquare.piece.hasMoved
        };

        if (
          sourceSquare.piece.type === "king" ||
          sourceSquare.piece.type === "rook"
        ) {
          console.log(
            `Piece moved: ${updatedPiece.color} ${updatedPiece.type}, hasMoved: ${updatedPiece.hasMoved}`
          );
        }

        return {
          ...square,
          piece: updatedPiece
        };
      }
      return square;
    })
  );
};

// KINGLOGIC + CASTLING -----------------------------------------------------------------------

const isHorizontalKingMove = (sourceRow, destinationRow) => {
  return sourceRow === destinationRow;
};

export const findKing = (color, chessBoard) => {
  for (const row of chessBoard) {
    for (const square of row) {
      if (
        square.piece &&
        square.piece.type === "king" &&
        square.piece.color === color
      ) {
        return square;
      }
    }
  }
};

const legalKingMove = (
  sourceSquare,
  destinationSquare,
  chessBoard,
  movedPieces
) => {
  const sourceRow = parseInt(sourceSquare.position[1]);
  const destinationRow = parseInt(destinationSquare.position[1]);
  const sourceColumn = sourceSquare.position[0];
  const destinationColumn = destinationSquare.position[0];

  const rowDifference = Math.abs(destinationRow - sourceRow);
  const columnDifference = Math.abs(
    destinationColumn.charCodeAt(0) - sourceColumn.charCodeAt(0)
  );

  const isOneSquareMove =
    (isVerticalMove(sourceColumn, destinationColumn) && rowDifference === 1) ||
    (isHorizontalKingMove(sourceRow, destinationRow) &&
      columnDifference === 1) ||
    (isDiagonalMove(sourceSquare, destinationSquare) &&
      rowDifference === 1 &&
      columnDifference === 1);

  const rookSourceColumn = destinationColumn < sourceColumn ? "a" : "h";
  const rookSquare = findSquare(chessBoard, `${rookSourceColumn}${sourceRow}`);

  const isCastlingMove =
    sourceRow === destinationRow &&
    columnDifference === 2 &&
    !sourceSquare.piece.hasMoved &&
    rookSquare.piece &&
    rookSquare.piece.type === "rook" &&
    !rookSquare.piece.hasMoved &&
    (!movedPieces || !movedPieces.has(`${sourceColumn}${sourceRow}`)) &&
    (!movedPieces ||
      !movedPieces.has(
        `${destinationColumn < sourceColumn ? "a" : "h"}${sourceRow}`
      ));

  if (isOneSquareMove || isCastlingMove) {
    if (
      !isMoveObstructed(
        sourceSquare,
        destinationSquare,
        chessBoard,
        isVerticalMove(sourceColumn, destinationColumn)
          ? "vertical"
          : isHorizontalKingMove(sourceRow, destinationRow)
          ? "horizontal"
          : "diagonal"
      )
    ) {
      return true;
    }
  }

  return false;
};

// LEGAL MOVE LOGIC -----------------------------------------------------------------------

export const isLegalMove = (
  sourceSquare,
  destinationSquare,
  chessBoard,
  pieceType
) => {
  if (
    !destinationSquare ||
    sourceSquare.position === destinationSquare.position
  ) {
    return false;
  }
  if (
    destinationSquare.piece &&
    sourceSquare.piece.color === destinationSquare.piece.color
  ) {
    return false;
  }

  let legal;
  switch (pieceType) {
    case "pawn":
      legal = legalPawnMove(sourceSquare, destinationSquare, chessBoard);
      break;
    case "rook":
      legal = legalRookMove(sourceSquare, destinationSquare, chessBoard);
      break;
    case "knight":
      legal = legalKnightMove(sourceSquare, destinationSquare, chessBoard);
      break;
    case "bishop":
      legal = legalBishopMove(sourceSquare, destinationSquare, chessBoard);
      break;
    case "queen":
      legal = legalQueenMove(sourceSquare, destinationSquare, chessBoard);
      break;
    case "king":
      legal = legalKingMove(sourceSquare, destinationSquare, chessBoard);
      break;
    default:
      return false;
  }
  return legal;
};

// CHECK LOGIC -----------------------------------------------------------------------

export const isKingAttacked = (kingColor, chessBoard) => {
  const kingSquare = findKing(kingColor, chessBoard);

  for (const row of chessBoard) {
    for (const square of row) {
      if (
        square.piece &&
        square.piece.color !== kingColor &&
        isLegalMove(square, kingSquare, chessBoard, square.piece.type)
      ) {
        console.log(
          `${kingSquare.piece.color} King at ${kingSquare.position} attacked by ${square.piece.type} at ${square.position}`
        );
        return true;
      }
    }
  }
  return false;
};

// CHECKMATE LOGIC -----------------------------------------------------------------------

export const isCheckmate = (kingColor, chessBoard) => {
  for (const row of chessBoard) {
    for (const sourceSquare of row) {
      if (sourceSquare.piece && sourceSquare.piece.color === kingColor) {
        for (const destRow of chessBoard) {
          for (const destinationSquare of destRow) {
            if (
              isLegalMove(
                sourceSquare,
                destinationSquare,
                chessBoard,
                sourceSquare.piece.type
              )
            ) {
              const tempBoard = makeMove(
                sourceSquare,
                destinationSquare,
                chessBoard
              );
              console.log(
                `Attempting move: ${sourceSquare.position} -> ${destinationSquare.position}`
              );
              if (!isKingAttacked(kingColor, tempBoard)) {
                return false;
              } else {
                console.log("King is still in check after this move.");
              }
            }
          }
        }
      }
    }
  }

  return true;
};
