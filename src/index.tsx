import React from "react";
import { render } from "react-dom";

import "./index.sass";

import { GameComponent } from "./components/Game";
import { GameState } from "./library/GameState";
import { delay } from "./library/delay";

const map = new Uint8Array(
  // [0, 1, 0, 0, 2, 2, 2, 1, 2, 1, 1, 0]
)

const dop = 2

const root = document.getElementById('root')
const gameState = map.length ? new GameState(map, dop) : GameState.generate(12, dop)

render(<GameComponent state={gameState} />, root)