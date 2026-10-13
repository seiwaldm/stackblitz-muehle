import { ADJACENCY, MILLS } from './board'
import type { CellValue, Player } from './types'

export function getMillsAt(board: CellValue[], point: number): number[] {
  const player = board[point]
  if (!player) return []
  return MILLS.filter(
    (mill) => mill.includes(point) && mill.every((p) => board[p] === player),
  ).map((mill) => MILLS.indexOf(mill))
}

export function getMillIndicesForPlayer(board: CellValue[], player: Player): Set<number> {
  const indices = new Set<number>()
  MILLS.forEach((mill, i) => {
    if (mill.every((p) => board[p] === player)) indices.add(i)
  })
  return indices
}

export function getAllMillPoints(board: CellValue[]): Set<number> {
  const points = new Set<number>()
  MILLS.forEach((mill) => {
    const first = board[mill[0]]
    if (first && mill.every((p) => board[p] === first)) {
      mill.forEach((p) => points.add(p))
    }
  })
  return points
}

export function formsNewMill(
  board: CellValue[],
  point: number,
  player: Player,
): boolean {
  return MILLS.some(
    (mill) =>
      mill.includes(point) &&
      mill.every((p) => board[p] === player),
  )
}

export function canMoveTo(board: CellValue[], from: number, to: number): boolean {
  if (board[to] !== null) return false
  return ADJACENCY[from].includes(to)
}

export function canFly(board: CellValue[], player: Player, piecesOnBoard: number): boolean {
  return piecesOnBoard === 3
}

export function hasValidMoves(board: CellValue[], player: Player, piecesOnBoard: number): boolean {
  if (piecesOnBoard <= 3) return true
  for (let i = 0; i < board.length; i++) {
    if (board[i] === player) {
      if (ADJACENCY[i].some((adj) => board[adj] === null)) return true
    }
  }
  return false
}

export function getRemovablePieces(
  board: CellValue[],
  opponent: Player,
): number[] {
  const all = getAllMillPoints(board)
  const nonMill = [] as number[]
  const inMill = [] as number[]

  for (let i = 0; i < board.length; i++) {
    if (board[i] === opponent) {
      if (all.has(i)) inMill.push(i)
      else nonMill.push(i)
    }
  }

  return nonMill.length > 0 ? nonMill : inMill
}
