import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as ChessJS from 'chess.js';
import { ChessService } from '../services/chess.service';

@Component({
  selector: 'app-chessboard',
  templateUrl: './chessboard.component.html',
  styles: [`
    .square {
      width: 50px;
      height: 50px;
      text-align: center;
      border: 1px solid black;
      position: relative; /* Added for absolute positioning of pieces */
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
      position: absolute; /* Pieces are absolutely positioned within squares */
      cursor: grab; /* Change cursor to grab on hover */
    }
    img:active {
      cursor: grabbing; /* Change cursor to grabbing when dragging */
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class ChessboardComponent implements OnInit {
  @ViewChild('board') boardContainer!: ElementRef;

  game: ChessJS.Chess = new ChessJS.Chess();
  board: string[][] = [];
  selectedPiece: { row: number, col: number, piece: string } | null = null;
  possibleMoves: { row: number, col: number }[] = [];

  constructor(private chessService: ChessService) {}

  ngOnInit(): void {
    this.updateBoard();
  }

  updateBoard() {
    this.board = this.game.board().map(row => row.map(piece => this.getPieceCode(piece)));
    this.possibleMoves = []; // Clear possible moves after each update
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

  onPieceClick(row: number, col: number, piece: string) {
    if (this.selectedPiece) {
      // Move piece
      const move = { from: this.getAlgebraicNotation(this.selectedPiece.row, this.selectedPiece.col),
                     to: this.getAlgebraicNotation(row, col) };
      if (this.game.move(move)) {
        this.updateBoard();
        this.selectedPiece = null;
      }
    } else {
      // Select piece
      this.selectedPiece = { row, col, piece };
      this.possibleMoves = this.chessService.getPossibleMoves(this.game, this.selectedPiece.row, this.selectedPiece.col);
    }
  }

  getAlgebraicNotation(row: number, col: number): string {
    const colName = String.fromCharCode(97 + col);
    return colName + (8 - row);
  }

  isPossibleMove(row: number, col: number): boolean {
    return this.possibleMoves.some(move => move.row === row && move.col === col);
  }

  isPieceSelected(row: number, col: number): boolean {
    return this.selectedPiece && this.selectedPiece.row === row && this.selectedPiece.col === col;
  }
}
