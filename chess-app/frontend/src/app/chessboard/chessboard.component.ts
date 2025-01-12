import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as ChessJS from 'chess.js';
import { ChessService } from '../services/chess.service';

@Component({
  selector: 'app-chessboard',
  templateUrl: './chessboard.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class ChessboardComponent implements OnInit {
  game: ChessJS.Chess = new ChessJS.Chess();
  board: { row: number; col: number; piece: string }[] = [];
  selectedPiece: { row: number; col: number; piece: string } | null = null;
  possibleMoves: { row: number; col: number }[] = [];
  dragging: boolean = false;
  draggedPiece: HTMLElement | null = null;
  initialPosition: { x: number; y: number } | null = null;

  constructor(private chessService: ChessService) {}

  ngOnInit(): void {
    this.updateBoard();
  }

  updateBoard() {
    this.board = [];
    const gameBoard = this.game.board();
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = gameBoard[i][j];
        this.board.push({ row: i, col: j, piece: this.getPieceCode(piece) });
      }
    }
    this.possibleMoves = [];
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

  onPieceMouseDown(event: MouseEvent, square: { row: number; col: number; piece: string }) {
    this.dragging = true;
    this.selectedPiece = square;
    this.possibleMoves = this.chessService.getPossibleMoves(this.game, square.row, square.col);
    this.draggedPiece = event.target as HTMLElement;
    this.initialPosition = { x: event.clientX, y: event.clientY };
    this.draggedPiece.style.position = 'absolute';
    this.draggedPiece.style.zIndex = '10';
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.dragging && this.draggedPiece) {
      const deltaX = event.clientX - this.initialPosition!.x;
      const deltaY = event.clientY - this.initialPosition!.y;
      this.draggedPiece.style.left = `${deltaX}px`;
      this.draggedPiece.style.top = `${deltaY}px`;
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (this.dragging && this.draggedPiece && this.selectedPiece) {
      const newSquare = this.findSquareFromCoordinates(event.clientX, event.clientY);
      if (newSquare && this.isPossibleMove(newSquare.row, newSquare.col)) {
        const move = { from: this.getAlgebraicNotation(this.selectedPiece.row, this.selectedPiece.col), to: this.getAlgebraicNotation(newSquare.row, newSquare.col) };
        if (this.game.move(move)) {
          this.updateBoard();
        }
      }
      this.resetDrag();
    }
  }

  findSquareFromCoordinates(x: number, y: number): { row: number; col: number } | null {
    // Implement logic to find the square based on coordinates.  This will depend on your board layout and size.
    // This is a placeholder, replace with your actual logic.
    const squareSize = 64 / 8; // Assuming 64px board
    const col = Math.floor(x / squareSize);
    const row = Math.floor(y / squareSize);
    if (col >= 0 && col < 8 && row >= 0 && row < 8) {
      return { row, col };
    }
    return null;
  }


  getAlgebraicNotation(row: number, col: number): string {
    const colName = String.fromCharCode(97 + col);
    return colName + (8 - row);
  }

  isPossibleMove(row: number, col: number): boolean {
    return this.possibleMoves.some(move => move.row === row && move.col === col);
  }

  resetDrag() {
    this.dragging = false;
    this.draggedPiece = null;
    this.selectedPiece = null;
    this.possibleMoves = [];
  }
}
