import React from "react";

import "./LinesMap.sass";

import { GameState } from "library/GameState";
import { LinesRowComponent } from "components/LinesRow";

export interface ILinesMapComponentProps {
  state: GameState
}

export const LinesMapComponent = ({ state }: ILinesMapComponentProps) => {
  const { rowsLines } = state

  return (
    <div className="lines-map-component">
      {
        rowsLines.map((rowsLine, index) => {
          return <LinesRowComponent 
            key={`rowLien-${index}`} 
            state={state} 
            rowsLine={rowsLine} />
        })
      }
    </div>
  )
}