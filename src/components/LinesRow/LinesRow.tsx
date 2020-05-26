import React from "react";

import "./LinesRow.sass";
import { GameState, IRow } from "../../library/GameState";
import { LineComponent } from "../Line/Line";

export interface ILinesRowComponentProps {
  state: GameState
  rowsLine: IRow[]
}

export const LinesRowComponent = ({state, rowsLine}: ILinesRowComponentProps) => {

  return (
    <div className="lines-row-component">
      {
        rowsLine.map((row, index) => {
          return <LineComponent 
            key={`row-${index}`} 
            state={state} 
            row={row} />
        })
      }
    </div>
  )
}