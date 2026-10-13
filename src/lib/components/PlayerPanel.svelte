<script lang="ts">
  import type { Player } from '../game/types'
  import { PIECES_PER_PLAYER } from '../game/board'

  interface Props {
    player: Player
    isCurrentTurn: boolean
    piecesToPlace: number
    piecesOnBoard: number
  }

  let { player, isCurrentTurn, piecesToPlace, piecesOnBoard }: Props = $props()

  const lostPieces = $derived(PIECES_PER_PLAYER - piecesToPlace - piecesOnBoard)
</script>

<div class="player-panel {player}" class:active={isCurrentTurn}>
  <div class="panel-header">
    <span class="player-dot {player}"></span>
    <span class="player-name">{player === 'white' ? 'White' : 'Black'}</span>
  </div>

  <div class="pieces-grid">
    {#each Array(PIECES_PER_PLAYER) as _, i}
      <span
        class="mini-piece {player}"
        class:placed={i < piecesOnBoard}
        class:unplaced={i >= piecesOnBoard && i < piecesOnBoard + piecesToPlace}
        class:lost={i >= piecesOnBoard + piecesToPlace}
      ></span>
    {/each}
  </div>

  <div class="stats">
    <span class="stat">To place: {piecesToPlace}</span>
    <span class="stat">On board: {piecesOnBoard}</span>
    <span class="stat lost-stat">Lost: {lostPieces}</span>
  </div>
</div>

<style>
  .player-panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px 20px;
    background: var(--panel-bg);
    border-radius: 12px;
    border: 1px solid var(--border);
    transition: all 0.3s ease;
  }

  .player-panel.active {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 1px var(--accent-color), 0 0 16px var(--accent-glow);
  }

  .panel-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 600;
    color: var(--text-h);
  }

  .player-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
  }

  .player-dot.white {
    background: radial-gradient(circle at 35% 30%, #fff, #d0d0d0 60%, #a8a8a8);
    border: 1px solid #999;
  }

  .player-dot.black {
    background: radial-gradient(circle at 35% 30%, #555, #2a2a2a 60%, #111);
    border: 1px solid #000;
  }

  .pieces-grid {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    gap: 4px;
  }

  .mini-piece {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  .mini-piece.white {
    background: radial-gradient(circle at 35% 30%, #fff, #d0d0d0 60%, #a8a8a8);
    border: 1px solid #999;
  }

  .mini-piece.black {
    background: radial-gradient(circle at 35% 30%, #555, #2a2a2a 60%, #111);
    border: 1px solid #000;
  }

  .mini-piece.placed {
    opacity: 1;
  }

  .mini-piece.unplaced {
    opacity: 0.4;
  }

  .mini-piece.lost {
    opacity: 0.12;
    filter: grayscale(1);
  }

  .stats {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 14px;
    color: var(--text);
  }

  .stat {
    line-height: 1.4;
  }

  .lost-stat {
    color: var(--text-h);
    opacity: 0.6;
  }
</style>
