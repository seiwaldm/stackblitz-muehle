export type Player = 'white' | 'black'

export type CellValue = Player | null

export type Phase = 'placing' | 'moving' | 'flying' | 'removing' | 'gameover'

export type Winner = Player | 'draw' | null

export interface GameState {
  board: CellValue[]
  currentPlayer: Player
  phase: Phase
  piecesToPlace: { white: number; black: number }
  piecesOnBoard: { white: number; black: number }
  selectedPoint: number | null
  mustRemove: boolean
  winner: Winner
  mills: Set<number>
}

export interface MoveResult {
  ok: boolean
  message?: string
}
