import React from "react";
import { render } from "react-dom";

import "./index.sass";

import { GameComponent } from "./components/Game";
import { GameState } from "./library/GameState";
import { delay } from "./library/delay";

const map = new Uint8Array(
  // [1, 5, 5, 2, 4, 6, 1, 4, 4, 2, 0, 3, 2, 0, 0, 3, 6, 1, 3, 0, 4, 1, 2, 3, 6, 6, 5, 5]
  // [3, 2, 0, 2, 3, 1, 1, 2, 1, 0, 0, 4, 3, 2, 1, 4, 0, 3, 4, 4]
  // [2, 0, 1, 2, 1, 2, 1, 2, 1, 0, 0, 0]
  // [0, 6, 3, 4, 5, 7, 5, 6, 6, 7, 3, 0, 3, 3, 7, 2, 6, 4, 2, 0, 4, 7, 5, 4, 2, 5, 0, 2, 1, 1, 1, 1]
  // [2, 2, 0, 3, 2, 2, 1, 3, 0, 1, 3, 0, 1, 1, 3, 0]
)

const ss = document.getElementById('ss')
const dop = 2
const staticMovies = [
  // [2, 5],
  // [1, 5],
  // [1, 4],
  // [5, 1],
  // [1, 3],
  // [5, 3],
  // [3, 1],
  // [0, 5],
  // [5, 4],
  // [1, 5],
  // [5, 3],
  // [1, 5],
  // [5, 3],
  // [4, 1],
  // [4, 1],
  // [0, 5],
  // [5, 2],
  // [0, 5],
  // [5, 3],
  // [0, 1]
]

const root = document.getElementById('root')
const gameState = map.length ? new GameState(map, dop) : GameState.generate(7, dop)

async function main() {
  if(!staticMovies.length) {
    const win = await gameState.calculate()

    if (!win) {
      console.log('Я обосрался')
      ss.innerText = `Решений нет`
    }
    else {
      ss.innerText = `${win.moves.length}`
      console.log('Я молодец!')
    }
  
    if(!win)
      return null
  
      
    console.log(win.moves)
  
    ss.innerText = `${win.moves.length}`
  
    for (let [a, b] of win.moves) {
      await delay(400)
      gameState.setSelect(a)
      await delay(400)
      gameState.move(a, b)
    }
  }else {

    for (let [a, b] of staticMovies) {
      await delay(400)
      gameState.setSelect(a)
      await delay(400)
      gameState.move(a, b)
    }
  }
}

render(<GameComponent state={gameState} />, root)
main().catch(console.error)