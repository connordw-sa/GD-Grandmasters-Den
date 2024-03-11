type PieceColor = "black" | "white";
type PieceType = "king" | "queen" | "bishop" | "knight" | "rook" | "pawn";

interface Piece {
  color: PieceColor;
  type: PieceType;
  position: string;
}

interface Square {
  position: string;
  piece?: Piece;
}

export const isVerticalMove = (
  source: string,
  destination: string
): boolean => {
  return source[0] === destination[0];
};

export const isHorizontalMove = (
  source: string,
  destination: string
): boolean => {
  return source[1] === destination[1];
};

export const isDiagonalMove = (
  source: Square,
  destination: Square
): boolean => {
  return (
    Math.abs(
      source.position.charCodeAt(0) - destination.position.charCodeAt(0)
    ) ===
    Math.abs(parseInt(source.position[1]) - parseInt(destination.position[1]))
  );
};

export const isSameColorPiece = (
  sourceSquare: Square,
  destinationSquare: Square
): boolean => {
  if (!destinationSquare.piece || !sourceSquare.piece) {
    return false;
  }
  return sourceSquare.piece.color === destinationSquare.piece.color;
};

export const isMoveObstructed = (
  sourceSquare: Square,
  destinationSquare: Square,
  chessBoard: Square[]
): boolean => {
  const path = getPath(sourceSquare.position, destinationSquare.position);

  return path.some((pos) => {
    const square = chessBoard.find((sq) => sq.position === pos);
    return square?.piece !== undefined;
  });
};

export const getPath = (source: string, destination: string): string[] => {
  const path = [];
  const [sourceColumn, sourceRow] = source.split("");
  const [destColumn, destRow] = destination.split("");

  const columnIncrement = sourceColumn < destColumn ? 1 : -1;
  const rowIncrement = sourceRow < destRow ? 1 : -1;

  const isVerticalMove = sourceColumn === destColumn;
  const isHorizontalMove = sourceRow === destRow;

  let currentColumnCode = sourceColumn.charCodeAt(0);
  let currentRow = parseInt(sourceRow);

  while (
    currentColumnCode !== destColumn.charCodeAt(0) ||
    currentRow !== parseInt(destRow)
  ) {
    if (!isVerticalMove && currentColumnCode !== destColumn.charCodeAt(0)) {
      currentColumnCode += columnIncrement;
    }
    if (!isHorizontalMove && currentRow !== parseInt(destRow)) {
      currentRow += rowIncrement;
    }

    const currentPosition = `${String.fromCharCode(
      currentColumnCode
    )}${currentRow}`;
    path.push(currentPosition);
  }

  return path;
};

export const getRowAndCol = (position: string): number[] => {
  const row = 8 - parseInt(position[1]);
  const col = position.charCodeAt(0) - "a".charCodeAt(0);
  return [row, col];
};

// const sourceSquare = {
//     position: piece.position,
//     piece: piece
//   };

//   const destinationSquare = {
//     position: targetPosition,
//     piece: newGameState.boardState.find(
//       (p: { position: string }) => p.position === targetPosition
//     )
//   };
//   // if (
//   //   !isVerticalMove(sourceSquare.position, destinationSquare.position)
//   // ) {
//   //   return;
//   // }

//   if (isSameColorPiece(sourceSquare, destinationSquare)) {
//     console.log("Same color piece!");
//     return;
//   }
//   if (
//     isMoveObstructed(
//       sourceSquare,
//       destinationSquare,
//       newGameState.boardState
//     )
//   ) {
//     console.log("Move is obstructed!");
//     return;
//   }
