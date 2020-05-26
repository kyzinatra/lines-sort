import React from "react";

import "./Line.sass";
import { GameState, IRow } from "../../library/GameState";
import { BallComponent } from "../Ball/Ball";

export interface ILineComponentProps {
  state: GameState
  row: IRow
}

export const LineComponent = ({ state, row }: ILineComponentProps) => {
  const { balls, index, select } = row
  const upped = { up() {
    upped.up = () => false
    return true
  }}

  return (
    <div className="line-component" onClick={() => state.click(index)}>
      {
        balls.map((ball, i) => {
          const {colorStyle, id, free} = ball
          const up = select && !free ? upped.up() : false

          return <BallComponent
            key={id} id={id} up={up}
            color={colorStyle} />
        })
      }
    </div>
  )
}