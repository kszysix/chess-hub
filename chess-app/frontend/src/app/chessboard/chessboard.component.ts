import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as ChessJS from 'chess.js';
import { ChessService } from '../services/chess.service';

@Component({
  selector: 'app-chessboard',
  templateUrl: './chessboard.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./chessboard.component.css']
})
export class ChessboardComponent implements OnInit {
  @ViewChild('boardCss') boardContainer!: ElementRef;

  game: ChessJS.Chess = new ChessJS.Chess();
  board: string[][] = [];
  selectedPiece: { row: number; col: number; piece: string } | null = null;
  possibleMoves: { row: number; col: number }[] = [];
  dragging: boolean = false;
  draggedPiece: HTMLElement | null = null;
  initialPosition: { x: number; y: number } | null = null;
  squareSize: number = 0;


  constructor(private chessService: ChessService) {}

  ngOnInit(): void {
    this.updateBoard();
  }

  ngAfterViewInit() {
    this.squareSize = this.boardContainer.nativeElement.offsetWidth / 8;
  }

  updateBoard() {
    this.board = this.game.board().map(row => row.map(piece => this.getPieceCode(piece)));
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

  onPieceMouseDown(event: MouseEvent, row: number, col: number, piece: string) {
    this.dragging = true;
    this.selectedPiece = { row, col, piece };
    this.possibleMoves = this.chessService.getPossibleMoves(this.game, row, col);
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
      const square = this.getSquareFromCoordinates(event.clientX, event.clientY);
      if (square && this.isPossibleMove(square.row, square.col)) {
        const move = { from: this.getAlgebraicNotation(this.selectedPiece.row, this.selectedPiece.col), to: this.getAlgebraicNotation(square.row, square.col) };
        if (this.game.move(move)) {
          this.updateBoard();
          this.centerPiece(square.row, square.col);
        }
      }
      this.resetDrag();
    }
  }

  getSquareFromCoordinates(x: number, y: number): { row: number; col: number } | null {
    const rect = this.boardContainer.nativeElement.getBoundingClientRect();
    const col = Math.floor((x - rect.left) / this.squareSize);
    const row = Math.floor((y - rect.top) / this.squareSize);
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

  centerPiece(row: number, col: number) {
    const piece = document.querySelector(`.square:nth-child(${row * 8 + col + 1}) img`) as HTMLElement; // Type assertion here
    if (piece) {
      piece.style.left = `calc(50% - ${piece.offsetWidth / 2}px)`;
      piece.style.top = `calc(50% - ${piece.offsetHeight / 2}px)`;
    }
  }
}
