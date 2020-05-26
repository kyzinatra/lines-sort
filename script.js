const config = {
  size: +localStorage.getItem('size') || 8,
  dops: +localStorage.getItem('dops') || 1 + (this.size > 2 ? 1 : 0),
  get rows() {
    return this.size + this.dops
  }
}

const maxColors = 12
const maxDops = 4

const state = { select: -1, array: new Uint8Array(0) }
const space = document.querySelector('.space')

function checkWin() {
  const rows = state.array.length / 4

  for (let r = 0; r < rows; r++)
    if (getRow(r).filter((e, i, g) => g[0] !== e).length)
      return false

  return true
}

function addRow() {
  const dop = new Uint8Array(4)
  state.array = new Uint8Array([...state.array, ...dop])
  render()
}

function generate() {
  const { size, rows } = config
  const array = new Uint8Array(size * 4)

  state.array = new Uint8Array(rows * 4)
  

  for (let c = 0; c < size; c++)
    for (let i = 0; i < 4; i++)
      array[c * 4 + i] = c + 1

  array.sort(e => Math.random() > 0.5 ? 1 : -1)

  for (let i = 0; i < array.length; i++)
    state.array[i] = array[i]

  render()
}

function click(i = 0) {
  return () => {
    if (checkWin())
      return null

    if (state.select == -1) {
      if (getRow(i).find(e => e))
        state.select = i
    } else if (state.select == i) {
      state.select = -1
    } else if (!canMove(state.select, i)) {
      state.select = i
    } else {
      move(state.select, i)
    }

    render()
  }
}

function getRow(n = 0) {
  const { array } = state
  return [...array].splice(n * 4, 4)
}

function canMove(a = 0, b = 0) {
  const aStep = getRow(a).find(e => e) || 0
  const bRow = getRow(b)
  const bStep = bRow.find(e => e) || 0
  const bNotNull = bRow.filter(e => e)

  if (bNotNull.length == 4)
    return false

  if (aStep == bStep || bStep == 0)
    return true

  return false
}

function move(a = 0, b = 0) {
  const { array } = state

  const indexA = a * 4 + 4 - getRow(a).filter(e => e).length
  const indexB = b * 4 + 3 - getRow(b).filter(e => e).length

  const value = array[indexA]

  array[indexA] = 0
  array[indexB] = value

  state.select = -1
}

function render() {
  space.innerHTML = ''
  
  const { array } = state
  const rows = array.length / 4
  const center = Math.ceil(rows / 2) - 1

  for (let r = 0; r < rows; r++) {
    const step = document.createElement('div')

    let need = true

    step.onclick = click(r)
    step.className = 'step'

    for (let i = 0; i < 4; i++) {
      const ball = document.createElement('div')
      const val = array[r * 4 + i]
      ball.className = `ball` + (val ? ` a c${val}` : '')

      if (need && val) {
        need = false
        ball.className += r == state.select ? ' sel' : ''
      }

      step.appendChild(ball)
    }

    space.appendChild(step)

    if (center == r) {
      const br = document.createElement('div')
      br.className = 'br'
      space.appendChild(br)
    }
  }

  setTimeout(() => {
    if (!checkWin())
      return null

    alert('You win!')
    generate()
  })
}

window.addEventListener('keydown', ({ key }) => {
  if (key === '+')
    addRow()
})

generate()