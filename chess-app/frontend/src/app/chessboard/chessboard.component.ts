import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import * as ChessJS from 'chess.js';

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
      border: 1px solid black;
    }
    .white {
      background-color: #f0d9b5;
    }
    .black {
      background-color: #b58863;
    }
  `],
  standalone: true,
  imports: [CommonModule] // Add CommonModule to imports
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
}
