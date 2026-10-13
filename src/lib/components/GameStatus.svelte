<script lang="ts">
  import type { GameState } from '../game/types'

  interface Props {
    state: GameState
  }

  let { state }: Props = $props()

  const phaseLabel = $derived(
    state.winner
      ? 'Game Over'
      : state.mustRemove
        ? 'Remove an opponent piece'
        : state.phase === 'placing'
          ? 'Place a piece'
          : state.phase === 'flying'
            ? 'Move a piece anywhere'
            : 'Move a piece',
  )

  const turnLabel = $derived(
    state.currentPlayer === 'white' ? "White's turn" : "Black's turn",
  )
</script>

<div class="game-status">
  <div class="turn-indicator {state.currentPlayer}">
    <span class="turn-dot"></span>
    <span class="turn-text">{turnLabel}</span>
  </div>
  <div class="phase-label">{phaseLabel}</div>
</div>

<style>
  .game-status {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 24px;
    background: var(--panel-bg);
    border-radius: 12px;
    border: 1px solid var(--border);
  }

  .turn-indicator {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-h);
  }

  .turn-dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .turn-indicator.white .turn-dot {
    background: radial-gradient(circle at 35% 30%, #fff, #d0d0d0 60%, #a8a8a8);
    border: 1px solid #999;
  }

  .turn-indicator.black .turn-dot {
    background: radial-gradient(circle at 35% 30%, #555, #2a2a2a 60%, #111);
    border: 1px solid #000;
  }

  .phase-label {
    font-size: 15px;
    color: var(--text);
  }
</style>
