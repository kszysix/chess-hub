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
    }
    .white {
      background-color: #f0d9b5;
    }
    .black {
      background-color: #b58863;
    }
  `]
})
export class ChessboardComponent implements OnInit {
  game: any;
  board: string[][] = [];

  constructor() { }

  ngOnInit(): void {
    this.game = new Chess();
    this.updateBoard();
  }

  updateBoard() {
    this.board = [];
    for (let i = 0; i < 8; i++) {
      let row = [];
      for (let j = 0; j < 8; j++) {
        let piece = this.game.get(Chess.SQUARES[8 * i + j]);
        row.push(piece ? piece.type + piece.color[0] : '');
      }
      this.board.push(row);
    }
  }

  makeMove(move: string) {
    if (this.game.move(move)) {
      this.updateBoard();
    }
  }
}
