<script lang="ts">
  import type { Winner } from '../game/types'

  interface Props {
    winner: Winner
    onPlayAgain: () => void
  }

  let { winner, onPlayAgain }: Props = $props()

  const message = $derived(
    winner === 'draw'
      ? "It's a draw!"
      : winner === 'white'
        ? 'White wins!'
        : 'Black wins!',
  )
</script>

<div class="overlay">
  <div class="modal">
    <h2>{message}</h2>
    <p>
      {winner === 'draw'
        ? 'Neither player could make a move.'
        : 'The opponent has fewer than 3 pieces or no valid moves.'}
    </p>
    <button onclick={onPlayAgain}>Play Again</button>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    animation: fade-in 0.3s ease;
  }

  .modal {
    background: var(--bg);
    border-radius: 16px;
    padding: 40px 48px;
    text-align: center;
    box-shadow: var(--board-shadow);
    max-width: 90%;
  }

  .modal h2 {
    font-size: 32px;
    margin: 0 0 12px;
  }

  .modal p {
    color: var(--text);
    margin-bottom: 24px;
    line-height: 1.5;
  }

  .modal button {
    background: var(--accent-color);
    color: #fff;
    border: none;
    padding: 12px 32px;
    font-size: 18px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .modal button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--accent-glow);
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>
