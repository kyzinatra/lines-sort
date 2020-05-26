import React, { useEffect } from "react";

import "./Game.sass";
import { GameState } from "../../library/GameState";
import { LinesMapComponent } from "../LinesMap/LinesMap";

export interface IGameComponentProps {
  state: GameState
}

export const GameComponent = ({ state }: IGameComponentProps) => {
  state.useState()

  useEffect(() => {
    const keydown = ({key}: KeyboardEvent) => {
      switch(key) {
        case 'Backspace': 
            state.back()
          break;

        case 'Escape':
            state.restart()
          break;
      }
    }

    document.addEventListener('keydown', keydown)

    return () => {
      document.removeEventListener('keydown', keydown)
    }
  })
  
  return (
    <div className="game-component">
      <LinesMapComponent state={state} />
    </div>
  )
}