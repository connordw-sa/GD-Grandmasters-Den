import GameModel from "../api/models/games.js";

export const socketHandler = (newClient) => {
  console.log("NEW CONNECTION:", newClient.id);

  newClient.on("fetch_game", (gameId) => {
    console.log(`Client ${newClient.id} fetched game ${gameId}`);
    newClient.join(gameId);
  });

  newClient.on("move", async (gameId, newGameState) => {
    console.log(`Client ${newClient.id} updated game ${gameId}`);
    await GameModel.updateOne({ _id: gameId }, newGameState);

    const updatedGame = await GameModel.findById(gameId);

    newClient
      .to(gameId)
      .emit("move_made", updatedGame && updatedGame.currentPlayer);
  });

  newClient.on("disconnect", () => {
    newClient.broadcast.emit("User disconnected");
  });
};
