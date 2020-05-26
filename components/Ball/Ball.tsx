import React from "react";

import "./Ball.sass";

export interface IBallComponentProps {
  id: string
  up: boolean
  color: string
}

export const BallComponent = ({id, up, color}: IBallComponentProps) => {

  return (
    <div 
      id={id} style={{backgroundColor: color}} 
      className={`ball-component ${up?'up':''}`} />
  )
}