<script lang="ts">
  import { createGameStore } from './lib/game/store.svelte'
  import Board from './lib/components/Board.svelte'
  import GameStatus from './lib/components/GameStatus.svelte'
  import PlayerPanel from './lib/components/PlayerPanel.svelte'
  import GameOverModal from './lib/components/GameOverModal.svelte'

  const game = createGameStore()
</script>

<div id="mill-game">
  <header>
    <h1>Mühle</h1>
    <p class="subtitle">The classic strategy game of mills and captures</p>
  </header>

  <div class="game-layout">
    <div class="side-panel">
      <PlayerPanel
        player="white"
        isCurrentTurn={game.state.currentPlayer === 'white' && !game.state.winner}
        piecesToPlace={game.state.piecesToPlace.white}
        piecesOnBoard={game.state.piecesOnBoard.white}
      />
    </div>

    <div class="board-area">
      <GameStatus state={game.state} />
      <Board
        state={game.state}
        validDestinations={game.getValidDestinations()}
        removableTargets={game.getRemovableTargets()}
        millsForCurrent={game.getCurrentMillsForPlayer(game.state.currentPlayer)}
        onPointClick={(p) => game.handlePointClick(p)}
      />
      <button class="reset-btn" onclick={() => game.reset()}>New Game</button>
    </div>

    <div class="side-panel">
      <PlayerPanel
        player="black"
        isCurrentTurn={game.state.currentPlayer === 'black' && !game.state.winner}
        piecesToPlace={game.state.piecesToPlace.black}
        piecesOnBoard={game.state.piecesOnBoard.black}
      />
    </div>
  </div>

  <section class="rules">
    <h2>How to Play</h2>
    <ol>
      <li><strong>Placing phase:</strong> Each player places 9 pieces on the board, alternating turns.</li>
      <li><strong>Moving phase:</strong> Once all pieces are placed, move a piece to an adjacent empty point.</li>
      <li><strong>Flying phase:</strong> When a player has only 3 pieces left, they may jump to any empty point.</li>
      <li><strong>Forming a mill:</strong> Align 3 of your pieces on a line to form a mill. Then remove one of your opponent's pieces.</li>
      <li><strong>Winning:</strong> Reduce your opponent to fewer than 3 pieces, or leave them with no valid moves.</li>
    </ol>
  </section>

  {#if game.state.winner}
    <GameOverModal winner={game.state.winner} onPlayAgain={() => game.reset()} />
  {/if}
</div>
