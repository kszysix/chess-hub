import { Component, OnInit } from '@angular/core';
import * as Chess from 'chess.js';

@Component({
  selector: 'app-chessboard',
  templateUrl: './chessboard.component.html',
  styles: [`
    .square {
      width: 50px;
      height: 50px;
      text-align: center;
      font-size: 30px;
      line-height: 50px;
      border: 1px solid black; /* Added border for better visibility */
    }
    .white {
      background-color: #f0d9b5;
    }
    .black {
      background-color: #b58863;
    }
  `],
  standalone: true
})
export class ChessboardComponent implements OnInit {
  game: Chess.ChessInstance;
  board: string[][] = [];

  ngOnInit(): void {
    this.game = new Chess();
    this.updateBoard();
  }

  updateBoard() {
    this.board = [];
    for (let i = 0; i < 8; i++) {
      const row = [];
      for (let j = 0; j < 8; j++) {
        const square = Chess.SQUARES[8 * i + j];
        const piece = this.game.get(square);
        row.push(piece ? piece.type + piece.color[0] : '');
      }
      this.board.push(row);
    }
  }
}
