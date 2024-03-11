import React, { useEffect } from "react";
import { useStore, UserData, GameData } from "../zustand/Store";
import { useNavigate } from "react-router-dom";
import MyNavbar from "../components/navbar/Navbar";
import leftImage from "../assets/background/background-one.png";
import rightImage from "../assets/background/background-two.png";
import rightImageTwo from "../assets/background/background-three.png";
import leftImageTwo from "../assets/background/background-four.png";
import { Button } from "react-bootstrap";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const logState = useStore((state) => state.logState);

  const currentUser = useStore((state) => state.user);
  const fetchUsers = useStore((state) => state.fetchUsers);
  const fetchGames = useStore((state) => state.fetchGames);
  const games = useStore((state) => state.userGames);
  const users = useStore((state) => state.users);

  const getOpponentUsername = (
    currentUser: UserData | null,
    game: GameData
  ) => {
    const { player1, player2 } = game;
    return player1?._id === currentUser?._id
      ? player2.username
      : player1?.username;
  };

  useEffect(() => {
    fetchUsers();
    fetchGames();
    logState();
  }, [fetchUsers, logState, fetchGames]);

  const createGame = async (player2Id: string) => {
    try {
      const response = await fetch("http://localhost:3001/games/createGame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify({ player2: player2Id })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const game = await response.json();
      console.log(game);
      navigate(`/game/${game._id}`);
    } catch (error) {
      console.error("Failed to create game", error);
    }
  };

  return (
    <>
      <MyNavbar />

      <div className="content-main-page text-light">
        <div className="section-one">
          <div className="text-center w-50">
            <h1 className="display-4">
              Welcome{" "}
              <span className="test display-1">{currentUser?.username}</span>
            </h1>
            <h3 className="display-5 text-center mt-5">
              Test your chess skills here.
            </h3>
          </div>
          <div className="images-box">
            <img src={leftImage} alt="Left" className="background-image" />
            <img src={rightImage} alt="Right" className="background-image" />
          </div>
        </div>

        <div className="section-two">
          <div className="half-section d-flex justify-content-around w-100">
            <div className="half-section-one mr-5 text-dark">
              <h2 className=" pb-3 text-center display-5">Start a new game</h2>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user._id}
                    className="d-flex justify-content-between m-3"
                  >
                    <span className="mt-2">{user.username}</span>
                    <Button
                      className="btn-left"
                      onClick={() => createGame(user._id)}
                    >
                      Challenge
                    </Button>
                  </div>
                ))
              ) : (
                <h1>No users</h1>
              )}
            </div>{" "}
            <div className="half-section-two  text-dark">
              <h2 className="pb-3 text-center  display-5">
                Continue where you left off
              </h2>
              {games && games.length > 0 ? (
                games.map((game) => (
                  <div
                    key={game._id}
                    className="d-flex justify-content-between m-4"
                  >
                    {" "}
                    <span className="mt-2">
                      {getOpponentUsername(currentUser, game)}{" "}
                    </span>
                    <Button
                      className="btn-right"
                      onClick={() => navigate(`/game/${game._id}`)}
                    >
                      Resume
                    </Button>
                  </div>
                ))
              ) : (
                <h3>No current games</h3>
              )}
            </div>
          </div>
          <div className="images-box">
            <img src={leftImageTwo} alt="Left 2" className="background-image" />
            <img
              src={rightImageTwo}
              alt="Right 2"
              className="background-image"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
