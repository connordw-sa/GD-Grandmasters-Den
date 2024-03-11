import React, { useEffect, useState } from "react";
import { useStore } from "../zustand/store";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbars/Navbar";
import leftImage from "../assets/background/background-one.png";
import rightImage from "../assets/background/background-two.png";
import rightImageTwo from "../assets/background/background-three.png";
import leftImageTwo from "../assets/background/background-four.png";
import { Button } from "react-bootstrap";

const HomePage = () => {
  const logState = useStore((state) => state.logState);
  const currentUser = useStore((state) => state.user);
  const getOpponentUsername = (game, userId) => {
    return game.player1._id === userId
      ? game.player2.username
      : game.player1.username;
  };
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/users/allUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });

      if (response.ok) {
        const users = await response.json();
        setUsers(users);
      } else {
        throw new Error("Failed to fetch users.");
      }
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const fetchUserGames = async () => {
    try {
      const response = await fetch("http://localhost:3001/games/userGames", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });

      if (response.ok) {
        const userGames = await response.json();
        setGames(userGames);
      } else {
        throw new Error("Failed to fetch user games.");
      }
    } catch (error) {
      console.error("Error fetching user games:", error.message);
    }
  };

  const createGame = async (player2Id) => {
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

  useEffect(() => {
    fetchUsers();
    fetchUserGames();
    logState();
  }, []);

  return (
    <>
      <Navbar />

      <div className="content-main-page text-light">
        <div className="section-one">
          <div className="text-center w-50">
            <h1 className="display-3">
              Welcome{" "}
              <span className="test display-3">{currentUser.username}</span>
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
                      {getOpponentUsername(game, currentUser._id)}
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
