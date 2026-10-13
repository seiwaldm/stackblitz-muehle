<script lang="ts">
  import type { CellValue, Player } from '../game/types'

  interface Props {
    x: number
    y: number
    value: CellValue
    isSelected: boolean
    isMillPoint: boolean
    isRemovable: boolean
    isValidDestination: boolean
    disabled: boolean
    onClick: () => void
  }

  let {
    x,
    y,
    value,
    isSelected,
    isMillPoint,
    isRemovable,
    isValidDestination,
    disabled,
    onClick,
  }: Props = $props()

  const colPct = $derived((x / 6) * 100)
  const rowPct = $derived((y / 6) * 100)
</script>

<button
  class="point"
  class:occupied={value !== null}
  class:mill={isMillPoint}
  class:removable={isRemovable}
  class:valid-dest={isValidDestination}
  class:selected={isSelected}
  class:disabled
  style="left: {colPct}%; top: {rowPct}%;"
  onclick={onClick}
  aria-label="Board point at column {x}, row {y}"
  disabled={disabled}
>
  {#if value}
    <span class="piece {value}"></span>
  {/if}
</button>

<style>
  .point {
    position: absolute;
    width: 36px;
    height: 36px;
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .point::before {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--board-line);
    transition: all 0.2s ease;
  }

  .point.disabled {
    cursor: default;
  }

  .piece {
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    transition: all 0.2s ease;
    box-shadow:
      0 2px 6px rgba(0, 0, 0, 0.3),
      inset 0 1px 2px rgba(255, 255, 255, 0.2);
  }

  .piece.white {
    background: radial-gradient(circle at 35% 30%, #fff, #d0d0d0 60%, #a8a8a8);
    border: 1px solid #999;
  }

  .piece.black {
    background: radial-gradient(circle at 35% 30%, #555, #2a2a2a 60%, #111);
    border: 1px solid #000;
  }

  .point:hover:not(.disabled)::before {
    width: 22px;
    height: 22px;
  }

  .point.selected .piece {
    transform: scale(1.15);
    box-shadow:
      0 0 0 3px var(--accent-color),
      0 0 12px var(--accent-color),
      0 2px 6px rgba(0, 0, 0, 0.3);
  }

  .point.mill .piece {
    box-shadow:
      0 0 0 2px var(--mill-glow),
      0 0 10px var(--mill-glow),
      0 2px 6px rgba(0, 0, 0, 0.3);
  }

  .point.removable .piece {
    animation: pulse-red 1s ease-in-out infinite;
    cursor: crosshair;
  }

  .point.removable::before {
    width: 30px;
    height: 30px;
    border: 2px solid #e74c3c;
    background: transparent;
  }

  .point.valid-dest::before {
    width: 24px;
    height: 24px;
    background: var(--accent-color);
    opacity: 0.5;
    animation: pulse-dest 1.2s ease-in-out infinite;
  }

  @keyframes pulse-red {
    0%, 100% {
      box-shadow:
        0 0 0 2px #e74c3c,
        0 0 8px rgba(231, 76, 60, 0.5),
        0 2px 6px rgba(0, 0, 0, 0.3);
    }
    50% {
      box-shadow:
        0 0 0 3px #e74c3c,
        0 0 16px rgba(231, 76, 60, 0.8),
        0 2px 6px rgba(0, 0, 0, 0.3);
    }
  }

  @keyframes pulse-dest {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.3); opacity: 0.8; }
  }
</style>
