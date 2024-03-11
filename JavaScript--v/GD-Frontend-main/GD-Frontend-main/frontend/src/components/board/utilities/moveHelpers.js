export const isVerticalMove = (source, destination) => {
  return source[0] === destination[0];
};

export const isHorizontalMove = (source, destination) => {
  return source[1] === destination[1];
};

export const isDiagonalMove = (source, destination) => {
  return (
    Math.abs(
      source.position.charCodeAt(0) - destination.position.charCodeAt(0)
    ) ===
    Math.abs(parseInt(source.position[1]) - parseInt(destination.position[1]))
  );
};

export const isSameColorPiece = (sourceSquare, destinationSquare) => {
  if (!destinationSquare.piece) {
    return false;
  }
  return sourceSquare.piece.color === destinationSquare.piece.color;
};

export const isMoveObstructed = (
  sourceSquare,
  destinationSquare,
  chessBoard
) => {
  const [sourceRow, sourceCol] = getRowAndCol(sourceSquare.position);
  const [destRow, destCol] = getRowAndCol(destinationSquare.position);

  const rowDirection = destRow > sourceRow ? 1 : destRow < sourceRow ? -1 : 0;
  const colDirection = destCol > sourceCol ? 1 : destCol < sourceCol ? -1 : 0;

  let currentRow = sourceRow + rowDirection;
  let currentCol = sourceCol + colDirection;

  while (currentRow !== destRow || currentCol !== destCol) {
    const currentSquare = chessBoard[currentRow][currentCol];
    if (currentSquare.piece) {
      return true;
    }

    currentRow += rowDirection;
    currentCol += colDirection;
  }

  return false;
};

const getRowAndCol = (position) => {
  const row = 8 - parseInt(position[1]);
  const col = position.charCodeAt(0) - "a".charCodeAt(0);
  return [row, col];
};
