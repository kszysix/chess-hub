import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as ChessJS from 'chess.js';

@Component({
  selector: 'app-chessboard',
  templateUrl: './chessboard.component.html',
  styles: [`
    .square {
      width: 50px;
      height: 50px;
      text-align: center;
      border: 1px solid black;
    }
    .white {
      background-color: #f0d9b5;
    }
    .black {
      background-color: #b58863;
    }
    img {
      width: 100%;
      height: 100%;
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class ChessboardComponent implements OnInit {
  game: ChessJS.Chess = new ChessJS.Chess();
  board: string[][] = [];

  ngOnInit(): void {
    this.updateBoard();
  }

  updateBoard() {
    this.board = [];
    for (let i = 0; i < 8; i++) {
      const row = [];
      for (let j = 0; j < 8; j++) {
        const square = ChessJS.SQUARES[8 * i + j];
        const piece = this.game.get(square);
        row.push(piece ? piece.type + piece.color[0] : '');
      }
      this.board.push(row);
    }
  }

  getPieceImage(piece: string): string {
    const color = piece[1];
    const type = piece[0];
    let imageName = '';
    switch (type) {
      case 'K': imageName = 'king'; break;
      case 'Q': imageName = 'queen'; break;
      case 'R': imageName = 'rook'; break;
      case 'B': imageName = 'bishop'; break;
      case 'N': imageName = 'knight'; break;
      case 'P': imageName = 'pawn'; break;
    }
    return `/assets/img/chesspieces/${color}${imageName}.png`;
  }
}
