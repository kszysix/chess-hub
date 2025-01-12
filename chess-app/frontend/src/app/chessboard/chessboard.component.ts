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
    this.board = this.game.board().map(row => row.map(piece => this.getPieceCode(piece)));
  }

  getPieceCode(piece: ChessJS.Piece | null): string {
    if (!piece) return '';
    return piece.color[0] + piece.type;
  }

  getPieceImage(piece: string): string {
    const color = piece[0];
    const type = piece[1].toUpperCase();
    return `assets/img/chesspiece/${color}${type}.png`;
  }
}
