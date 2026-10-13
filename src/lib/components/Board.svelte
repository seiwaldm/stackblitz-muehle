<script lang="ts">
  import { POINTS, MILLS } from '../game/board'
  import type { CellValue, GameState, Player } from '../game/types'
  import BoardPoint from './BoardPoint.svelte'

  interface Props {
    state: GameState
    validDestinations: number[]
    removableTargets: number[]
    millsForCurrent: Set<number>
    onPointClick: (point: number) => void
  }

  let {
    state,
    validDestinations,
    removableTargets,
    millsForCurrent,
    onPointClick,
  }: Props = $props()

  // Build the line segments that connect board points.
  const lines = (() => {
    const segments: { x1: number; y1: number; x2: number; y2: number }[] = []
    const coord = (id: number) => {
      const p = POINTS[id]
      return { x: (p.x / 6) * 100, y: (p.y / 6) * 100 }
    }

    // Outer square
    const outer = [0, 1, 2, 14, 23, 22, 21, 9]
    for (let i = 0; i < outer.length; i++) {
      const a = coord(outer[i])
      const b = coord(outer[(i + 1) % outer.length])
      segments.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y })
    }

    // Middle square
    const middle = [3, 4, 5, 13, 20, 19, 18, 10]
    for (let i = 0; i < middle.length; i++) {
      const a = coord(middle[i])
      const b = coord(middle[(i + 1) % middle.length])
      segments.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y })
    }

    // Inner square
    const inner = [6, 7, 8, 12, 17, 16, 15, 11]
    for (let i = 0; i < inner.length; i++) {
      const a = coord(inner[i])
      const b = coord(inner[(i + 1) % inner.length])
      segments.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y })
    }

    // Connecting lines
    const connectors: [number, number][] = [
      [1, 4], [4, 7],
      [9, 10], [10, 11],
      [12, 13], [13, 14],
      [16, 19], [19, 22],
    ]
    for (const [a, b] of connectors) {
      const ca = coord(a)
      const cb = coord(b)
      segments.push({ x1: ca.x, y1: ca.y, x2: cb.x, y2: cb.y })
    }

    return segments
  })()

  function isPointInMill(pointId: number): boolean {
    return MILLS.some(
      (mill) =>
        mill.includes(pointId) &&
        mill.every((p) => state.board[p] === state.board[pointId]) &&
        state.board[pointId] !== null,
    )
  }
</script>

<div class="board">
  <svg class="board-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
    {#each lines as line}
      <line
        x1={line.x1}
        y1={line.y1}
        x2={line.x2}
        y2={line.y2}
        class="board-line"
      />
    {/each}
  </svg>

  {#each POINTS as point (point.id)}
    {@const validDest = validDestinations.includes(point.id)}
    {@const removable = removableTargets.includes(point.id)}
    {@const isMill = isPointInMill(point.id)}
    {@const isSelected = state.selectedPoint === point.id}
    {@const disabled =
      state.winner !== null ||
      (state.phase === 'removing' && !removable) ||
      (state.mustRemove && !removable) ||
      (!state.mustRemove &&
        state.phase === 'placing' &&
        state.board[point.id] !== null &&
        !validDest) ||
      (!state.mustRemove &&
        (state.phase === 'moving' || state.phase === 'flying') &&
        state.board[point.id] !== state.currentPlayer &&
        !validDest &&
        state.selectedPoint !== point.id)}

    <BoardPoint
      x={point.x}
      y={point.y}
      value={state.board[point.id]}
      {isSelected}
      {isMill}
      {removable}
      isValidDestination={validDest}
      {disabled}
      onClick={() => onPointClick(point.id)}
    />
  {/each}
</div>

<style>
  .board {
    position: relative;
    width: 100%;
    max-width: 520px;
    aspect-ratio: 1;
    margin: 0 auto;
    background: var(--board-bg);
    border-radius: 16px;
    padding: 8%;
    box-sizing: border-box;
    box-shadow: var(--board-shadow);
  }

  .board-lines {
    position: absolute;
    top: 8%;
    left: 8%;
    width: 84%;
    height: 84%;
  }

  .board-line {
    stroke: var(--board-line);
    stroke-width: 0.8;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
  }
</style>
