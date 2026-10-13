import { ADJACENCY, MILLS, PIECES_PER_PLAYER, TOTAL_POINTS } from './board'
import {
  formsNewMill,
  getRemovablePieces,
  hasValidMoves,
} from './rules'
import type { CellValue, GameState, Phase, Player, Winner } from './types'

function createInitialState(): GameState {
  return {
    board: new Array<CellValue>(TOTAL_POINTS).fill(null),
    currentPlayer: 'white',
    phase: 'placing',
    piecesToPlace: { white: PIECES_PER_PLAYER, black: PIECES_PER_PLAYER },
    piecesOnBoard: { white: 0, black: 0 },
    selectedPoint: null,
    mustRemove: false,
    winner: null,
    mills: new Set<number>(),
  }
}

function opponent(player: Player): Player {
  return player === 'white' ? 'black' : 'white'
}

function computePhase(
  piecesToPlace: { white: number; black: number },
  piecesOnBoard: { white: number; black: number },
  player: Player,
): Phase {
  if (piecesToPlace.white > 0 || piecesToPlace.black > 0) return 'placing'
  if (piecesOnBoard[player] <= 3) return 'flying'
  return 'moving'
}

function updateMills(state: GameState): void {
  const mills = new Set<number>()
  MILLS.forEach((mill, i) => {
    const first = state.board[mill[0]]
    if (first && mill.every((p) => state.board[p] === first)) {
      mills.add(i)
    }
  })
  state.mills = mills
}

function checkWinner(state: GameState): Winner {
  const { piecesOnBoard, piecesToPlace } = state

  if (piecesToPlace.white > 0 || piecesToPlace.black > 0) return null

  if (piecesOnBoard.white < 3) return 'black'
  if (piecesOnBoard.black < 3) return 'white'

  const current = state.currentPlayer
  if (!hasValidMoves(state.board, current, piecesOnBoard[current])) {
    return opponent(current)
  }

  return null
}

export function createGameStore() {
  let state = $state<GameState>(createInitialState())

  function reset(): void {
    state = createInitialState()
  }

  function getCurrentMillsForPlayer(player: Player): Set<number> {
    const result = new Set<number>()
    MILLS.forEach((mill, i) => {
      if (mill.every((p) => state.board[p] === player)) result.add(i)
    })
    return result
  }

  function handlePointClick(point: number): void {
    if (state.winner) return

    if (state.mustRemove) {
      removePiece(point)
      return
    }

    if (state.phase === 'placing') {
      placePiece(point)
    } else {
      handleMovePhase(point)
    }
  }

  function placePiece(point: number): void {
    if (state.board[point] !== null) return

    const player = state.currentPlayer
    state.board[point] = player
    state.piecesToPlace[player] -= 1
    state.piecesOnBoard[player] += 1

    updateMills(state)

    if (formsNewMill(state.board, point, player)) {
      state.mustRemove = true
      return
    }

    endTurn()
  }

  function handleMovePhase(point: number): void {
    const player = state.currentPlayer

    if (state.selectedPoint === null) {
      if (state.board[point] === player) {
        state.selectedPoint = point
      }
      return
    }

    if (state.selectedPoint === point) {
      state.selectedPoint = null
      return
    }

    if (state.board[point] === player) {
      state.selectedPoint = point
      return
    }

    if (state.board[point] === null) {
      tryMove(state.selectedPoint, point)
    }
  }

  function tryMove(from: number, to: number): void {
    const player = state.currentPlayer
    const isFlying = state.phase === 'flying'

    if (!isFlying && !ADJACENCY[from].includes(to)) return

    state.board[from] = null
    state.board[to] = player
    state.selectedPoint = null

    updateMills(state)

    if (formsNewMill(state.board, to, player)) {
      state.mustRemove = true
      return
    }

    endTurn()
  }

  function removePiece(point: number): void {
    const opp = opponent(state.currentPlayer)
    const removable = getRemovablePieces(state.board, opp)

    if (!removable.includes(point)) return

    state.board[point] = null
    state.piecesOnBoard[opp] -= 1
    state.mustRemove = false

    updateMills(state)
    endTurn()
  }

  function endTurn(): void {
    state.currentPlayer = opponent(state.currentPlayer)
    state.selectedPoint = null

    const winner = checkWinner(state)
    if (winner) {
      state.winner = winner
      state.phase = 'gameover'
      return
    }

    state.phase = computePhase(
      state.piecesToPlace,
      state.piecesOnBoard,
      state.currentPlayer,
    )
  }

  function getRemovableTargets(): number[] {
    if (!state.mustRemove) return []
    return getRemovablePieces(state.board, opponent(state.currentPlayer))
  }

  function getValidDestinations(): number[] {
    if (state.selectedPoint === null) return []
    const player = state.currentPlayer
    const isFlying = state.phase === 'flying' && state.piecesOnBoard[player] <= 3

    if (isFlying) {
      const empty: number[] = []
      for (let i = 0; i < state.board.length; i++) {
        if (state.board[i] === null) empty.push(i)
      }
      return empty
    }

    return ADJACENCY[state.selectedPoint].filter((p) => state.board[p] === null)
  }

  return {
    get state() {
      return state
    },
    reset,
    handlePointClick,
    getCurrentMillsForPlayer,
    getRemovableTargets,
    getValidDestinations,
  }
}

export type GameStore = ReturnType<typeof createGameStore>
