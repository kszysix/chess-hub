import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as ChessJS from 'chess.js';

interface ChessboardConfig {
  size: number;
  orientation: 'white' | 'black';
  startingFen: string;
  mode: 'game' | 'edit';
}

@Component({
  selector: 'app-chessboard',
  templateUrl: './chessboard.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class ChessboardComponent implements OnInit {
  @ViewChild('board') boardContainer!: ElementRef;

  config: ChessboardConfig = {
    size: 400,
    orientation: 'white',
    startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    mode: 'game',
  };

  game: ChessJS.Chess = new ChessJS.Chess();
  board: { row: number; col: number; piece: string | null }[][] = [];
  squareSize: number = 0;
  selectedPiece: { row: number; col: number; piece: string } | null = null;
  initialPosition: { x: number; y: number } | null = null;
  draggedPiece: HTMLElement | null = null;
  possibleMoves: { row: number; col: number }[] = [];

  ngOnInit(): void {
    this.game.load(this.config.startingFen);
    this.updateBoard();
  }

  ngAfterViewInit(): void {
    this.squareSize = this.boardContainer.nativeElement.offsetWidth / 8;
  }

  updateBoard(): void {
    this.board = this.game.board().map((row, rowIndex) =>
      row.map((piece, colIndex) => ({
        row: rowIndex,
        col: colIndex,
        piece: piece ? `${piece.color}${piece.type.toUpperCase()}` : null,
      }))
    );
  }

  getPieceImage(piece: string | null): string {
    return piece ? `assets/img/chesspiece/${piece}.png` : '';
  }

  onPieceMouseDown(event: MouseEvent, square: { row: number; col: number; piece: string | null }): void {
    if (!square.piece) return;
    this.selectedPiece = { ...square, piece: square.piece };
    this.initialPosition = { x: event.clientX, y: event.clientY };
    this.draggedPiece = event.target as HTMLElement;
    this.draggedPiece.style.position = 'absolute';
    this.draggedPiece.style.zIndex = '10';
    this.possibleMoves = this.game.moves({ verbose: true }).map((move) => ({
      row: 8 - parseInt(move.to.slice(1)),
      col: move.to.charCodeAt(0) - 97,
    }));
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.dragging && this.draggedPiece) {
      const deltaX = event.clientX - this.initialPosition!.x;
      const deltaY = event.clientY - this.initialPosition!.y;
      this.draggedPiece.style.left = `${parseInt(this.draggedPiece.style.left || '0') + deltaX}px`;
      this.draggedPiece.style.top = `${parseInt(this.draggedPiece.style.top || '0') + deltaY}px`;
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (this.dragging && this.draggedPiece && this.selectedPiece) {
      const newSquare = this.findSquareFromCoordinates(event.clientX, event.clientY);
      if (newSquare) {
        this.makeMove(this.selectedPiece.row, this.selectedPiece.col, newSquare.row, newSquare.col);
      }
      this.resetDrag();
    }
  }

  makeMove(fromRow: number, fromCol: number, toRow: number, toCol: number): void {
    const move = {
      from: `${String.fromCharCode(97 + fromCol)}${8 - fromRow}`,
      to: `${String.fromCharCode(97 + toCol)}${8 - toRow}`,
    };
    if (this.game.move(move)) {
      this.updateBoard();
      if (this.config.mode === 'game') {
        this.game.turn() === 'w' ? (this.config.orientation = 'white') : (this.config.orientation = 'black');
      }
    } else {
      this.resetDrag();
    }
  }

  findSquareFromCoordinates(x: number, y: number): { row: number; col: number } | null {
    const boardRect = this.boardContainer.nativeElement.getBoundingClientRect();
    const col = Math.floor((x - boardRect.left) / this.squareSize);
    const row = Math.floor((y - boardRect.top) / this.squareSize);
    return col >= 0 && col < 8 && row >= 0 && row < 8 ? { row, col } : null;
  }

  resetDrag(): void {
    this.dragging = false;
    this.selectedPiece = null;
    this.possibleMoves = [];
    if (this.draggedPiece) {
      this.draggedPiece.style.position = 'relative';
      this.draggedPiece.style.zIndex = '0';
      this.draggedPiece.style.left = '0';
      this.draggedPiece.style.top = '0';
    }
    this.draggedPiece = null;
  }

  get dragging(): boolean {
    return this.selectedPiece !== null;
  }

  get isWhiteTurn(): boolean {
    return this.game.turn() === 'w';
  }

  get rotated(): boolean {
    return this.config.orientation === 'black';
  }
}
