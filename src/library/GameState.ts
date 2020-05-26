
import { useState, useEffect } from "react";
import { delay } from "./delay";

const s = document.getElementById('s')
const w = document.getElementById('w')

export type TColor = [number, number, number]
export type THandler = () => void

const lineSize = 4

export interface IRow {
  select: boolean
  index: number
  balls: Ball[]
  first(this: IRow, ball: Ball): boolean
}

export type TMove = [number, number]

export const ColorList: TColor[] = [
  [0x51, 0x99, 0xFF],
  [0x23, 0x00, 0xB0],
  [0x76, 0xFE, 0xC5],
  [0x00, 0xCF, 0x91],
  [0x00, 0x41, 0x56],
  [0x1E, 0x3C, 0x00],
  [0xFF, 0xD6, 0x00],
  [0xD2, 0xAA, 0x1B],
  [0xFF, 0x75, 0x6B],
  [0xE8, 0xD5, 0xD5],
  [0x46, 0x00, 0x00],
  [0xEF, 0x2F, 0xA2],
  [0x38, 0x04, 0x38],
  [0xA4, 0x00, 0xFF],
  [0x23, 0x1F, 0x20]
]

export class Ball {
  id: string
  free = false

  get colorStyle() {
    if (this.free)
      return 'transparent'

    return `rgb(${this.color.join(',')})`
  }

  get color(): TColor {
    const { colorIndex } = this
    if (colorIndex == -1) {
      this.free = true
      return <any>[0, 0, 0]
    }

    return <any>[...ColorList[colorIndex]]
  }

  constructor(private game: GameState, index: number, public colorIndex: number = -1) {
    const { color } = this
    this.id = [index, ...color].map(e => e.toString(16)).join('')
  }

  static free(game: GameState, index: number) {
    return new this(game, index, -1)
  }
}

export class GameState {
  balls: Ball[] = []
  handlers: THandler[] = []
  steps: Array<Ball[]> = []
  stepsHash: string[] = []
  select: number = -1
  startState: Ball[] = []
  moves: TMove[] = []
  win = false

  get rows() {
    const rows: IRow[] = []

    for (let i = 0; i < this.size; i++) {
      rows.push({
        select: i == this.select,
        index: i,
        balls: this.getRow(i),
        first(this: IRow, ball: Ball) {
          const { balls: bs } = this
          const i = bs.indexOf(ball)
          return i == 0
        }
      })
    }

    return rows
  }

  get rowsLines() {
    const { rows, size } = this
    const center = size > 5 ? Math.ceil(size / 2) : 0
    return center ? [rows, rows.splice(center)] : [rows]
  }

  get size() {
    return this.balls.length / lineSize
  }

  constructor(map: Uint8Array, dop: number = 1) {
    for (let i = 0; i < map.length + dop * lineSize; i++) {
      let colorIndex = map[i]
      let ball: Ball

      if (colorIndex !== undefined)
        ball = new Ball(this, i, colorIndex)
      else
        ball = Ball.free(this, i)

      this.balls.push(ball)
    }

    this.startState = [...this.balls]
    this.reduceHandelrs = this.reduceHandelrs.bind(this)
  }

  getHashBalls(balls: Ball[]) {
    const nowBalls = [...balls]
    const rows: Array<Ball[]> = []

    while(nowBalls.length)
      rows.push(nowBalls.splice(0, lineSize))
      
    return rows.map((e, i) =>  [i,...e.map(e => e.colorIndex).filter(e => e !== -1)].join(';'))
  }

  reduceHandelrs() {
    for (let hand of this.handlers)
      hand()
  }

  appendLine() {
    for (let i = 0; i < lineSize; i++)
      this.balls.push(null)

    this.reduceHandelrs()
  }

  canMove(rowA: number, rowB: number) {
    const row = this.getRow(rowB)

    if (row.filter(e => !e.free).length == lineSize)
      return false

    const topA = this.getTop(rowA)
    const topB = this.getTop(rowB)

    if (topB.free || topA.colorIndex == topB.colorIndex)
      return true

    return false
  }

  click(rowIndex: number) {
    if (this.win)
      return null

    if (this.select == -1) {
      const rowTop = this.getTop(rowIndex)
      if (!rowTop.free) this.setSelect(rowIndex)
    } else if (this.select == rowIndex) {
      this.setSelect()
    } else if (!this.canMove(this.select, rowIndex)) {
      this.setSelect(rowIndex)
    } else {
      this.move(this.select, rowIndex)
    }
  }

  setSelect(rowIndex: number = -1) {
    this.select = rowIndex
    this.reduceHandelrs()
  }

  move(rowA: number, rowB: number) {
    const indexA = this.getTopIndex(rowA)
    const indexB = this.getTopIndex(rowB, true)

    const step = [...this.balls]

    this.moves.push([rowA, rowB])
    this.steps.push(step)

    const a = this.balls[indexA]
    const b = this.balls[indexB]

    this.balls[indexA] = b
    this.balls[indexB] = a

    const hash = this.getHashBalls(step)

    if(this.stepsHash.indexOf(hash[rowA]) == -1)
      this.stepsHash.push(hash[rowA])

    if(this.stepsHash.indexOf(hash[rowA]) == -1)
      this.stepsHash.push(hash[rowB])

    this.select = -1

    this.checkWin()
    this.reduceHandelrs()
  }

  fakeMove(rowA: number, rowB: number) {
    const { balls, moves, steps, reduceHandelrs, stepsHash } = this

    this.balls = [...balls]
    this.steps = []
    this.moves = []
    this.stepsHash = []
    this.reduceHandelrs = () => { }

    this.move(rowA, rowB)

    const newBalls = this.balls

    this.balls = balls
    this.steps = steps
    this.moves = moves
    this.stepsHash = stepsHash
    this.reduceHandelrs = reduceHandelrs

    return newBalls
  }

  restart() {
    if (!this.steps.length)
      return null

    this.steps = []
    this.stepsHash = []
    this.moves = []
    this.balls = [...this.startState]
    this.reduceHandelrs()
  }

  back() {
    if (!this.steps.length)
      return null

    this.balls = [...this.steps.pop()]
    this.moves.pop()
    this.stepsHash.pop()
    this.reduceHandelrs()
  }

  getRow(rowIndex: number) {
    const row: Ball[] = []

    for (let i = rowIndex * lineSize; i < rowIndex * lineSize + lineSize; i++)
      row.push(this.balls[i])

    return row
  }

  getTop(rowIndex: number, pre = false) {
    const row = this.getRow(rowIndex)

    let preBall: Ball

    for (let ball of row)
      if (!ball.free)
        return pre ? preBall : ball
      else
        preBall = ball

    return preBall
  }

  getTopIndex(rowIndex: number, pre = false) {
    const rowTop = this.getTop(rowIndex, pre)
    return this.balls.indexOf(rowTop)
  }

  useState() {
    const [, update] = useState(0)

    useEffect(() => {
      let i = 0
      const handler = () => {
        if (i > 8) i = 0
        update(++i)
      }

      this.handlers.push(handler)

      return () => {
        let index = this.handlers.indexOf(handler)

        if (index !== -1)
          this.handlers.splice(index, 1)
      }
    }, [])
  }

  checkWin() {
    for (let i = 0; i < this.size; i++) {
      const row = this.getRow(i).filter((e, i, d) => d[0].colorIndex !== e.colorIndex)
      if (row.length)
        return this.win = false
    }

    return this.win = true
  }

  hasStep(balls: Ball[], a: number, b: number) {
    const hashBalls = this.getHashBalls(balls)
    const hashA = hashBalls[a]
    const hashB = hashBalls[b]

    if(this.stepsHash.indexOf(hashA) !== -1 && this.stepsHash.indexOf(hashB) !== -1)
      return true

    return false
  }

  clone() {
    const { balls, steps, stepsHash, startState, moves } = this
    const newState = new GameState(new Uint8Array(0), 0)

    newState.balls = [...balls]
    newState.steps = [...steps]
    newState.moves = [...moves]
    newState.stepsHash = [...stepsHash]
    newState.startState = [...startState]

    return newState
  }

  async calculate(state = this) {
    const tasks: GameState[] = [state]
    const wins: GameState[] = []

    s.innerText = `${tasks.length}`

    while (tasks.length) {
      const now = tasks.shift().clone()
      s.innerText = `${tasks.length}`
      await delay()

      for (let a = 0; a < now.size; a++) {
        for (let b = 0; b < now.size; b++) {
          if (a !== b) {
            const stepNow = now.clone()

            if (stepNow.canMove(a, b)) {
              const preState = stepNow.fakeMove(a, b)

              if (!stepNow.hasStep(preState, a, b)) {

                stepNow.move(a, b)

                if (!stepNow.win) {
                  tasks.push(stepNow)
                  s.innerText = `${tasks.length}`
                }
                else {
                  return stepNow
                }
              }
            }
          }
        }
      }
    }

    return null
  }

  static generate(size: number, dop: number) {
    const array = new Uint8Array(size * lineSize)


    for (let i = 0; i < array.length; i++)
      array[i] = (i - (i % lineSize)) / lineSize

    array.sort(() => Math.random() > 0.5 ? 1 : -1)

    console.log(array)
    return new this(array, dop)
  }
}