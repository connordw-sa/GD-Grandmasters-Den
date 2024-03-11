import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChessBoard from "../components/board/Board";
import { useStore, GameData } from "../zustand/Store";
import { io, Socket } from "socket.io-client";

type ParamTypes = {
  gameId: string;
};

const GamePage: React.FC = () => {
  const { gameId = "" } = useParams<ParamTypes>();
  const fetchCurrentGame = useStore((state) => state.fetchCurrentGame);
  const updateCurrentGame = useStore((state) => state.updateCurrentGame);
  const setCurrentPlayerId = useStore((state) => state.setCurrentPlayerId);
  const currentGame = useStore((state) => state.currentGame);
  const [socket, setSocket] = useState<Socket | null>(null);
  const currentUserId = useStore((state) => state.user?._id);
  const userColor =
    currentGame?.player1._id === currentUserId ? "white" : "black";

  useEffect(() => {
    if (gameId) fetchCurrentGame(gameId);
  }, [fetchCurrentGame, gameId]);

  useEffect(() => {
    const newSocket = io("http://localhost:3001", {
      transports: ["websocket"]
    });

    newSocket.emit("fetch_game", gameId);

    newSocket.on("game_updated", (updatedGame: GameData) => {
      console.log(updatedGame);
      updateCurrentGame(updatedGame);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [updateCurrentGame, gameId]);

  useEffect(() => {
    const newSocket = io("http://localhost:3001", {
      transports: ["websocket"]
    });

    newSocket.emit("fetch_game", gameId);
    newSocket.on("move_made", (currentPlayerId: string) => {
      setCurrentPlayerId(currentPlayerId);

      fetchCurrentGame(gameId);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [
    fetchCurrentGame,
    gameId,
    currentGame?.currentPlayer,
    setCurrentPlayerId
  ]);

  return (
    <div>
      <h1>Hello</h1>
      <h1>
        {currentGame?.player1.username} vs {currentGame?.player2.username}
      </h1>
      <ChessBoard
        key={currentGame?.currentPlayer}
        gameState={currentGame}
        socket={socket}
        userColor={userColor}
        userId={currentUserId}
      />
    </div>
  );
};

export default GamePage;
