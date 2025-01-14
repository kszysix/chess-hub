import { Component, Input, AfterViewInit, ElementRef, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { Chess, Square, Move, PieceSymbol } from 'chess.js';
import { CommonModule } from '@angular/common'; // Import CommonModule

interface BoardConfig {
  size: number;
  orientation: 'white' | 'black';
  fen: string;
  mode: 'game' | 'analysis';
}

@Component({
  selector: 'app-chessboard2',
  template: `
    <div #chessboardContainer class="chessboard-container" [style.width.px]="config.size" [style.height.px]="config.size">
      <div #chessboard class="chessboard" [style.transform]="boardRotation">
        <div *ngFor="let row of rows; let rowIndex = index" class="board-row">
          <div *ngFor="let col of cols; let colIndex = index"
               class="board-square"
               [class.light]="(rowIndex + colIndex) % 2 === 0"
               [class.dark]="(rowIndex + colIndex) % 2 !== 0"
               [attr.data-square]="getSquareName(rowIndex, colIndex)"
               (dragover)="allowDrop($event)"
               (drop)="drop($event, getSquareName(rowIndex, colIndex))"
               >
            <img *ngIf="board[getSquareName(rowIndex, colIndex)]"
                 [src]="getPieceImage(board[getSquareName(rowIndex, colIndex)])"
                 draggable="true"
                 (dragstart)="drag($event, getSquareName(rowIndex, colIndex))"
                 class="chess-piece"
                 [style.width.px]="squareSize"
                 [style.height.px]="squareSize"
                 [attr.data-piece]="board[getSquareName(rowIndex, colIndex)]"
                 [style.transform]="pieceRotation"
                 />
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./chessboard.component.css'],
  standalone: true,
  imports: [CommonModule] // Add CommonModule to imports
})
export class ChessboardComponent2 implements AfterViewInit, OnDestroy {
  @Input() config: BoardConfig = {
    size: 400,
    orientation: 'white',
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    mode: 'game'
  };

  @ViewChild('chessboardContainer', { static: true }) chessboardContainer!: ElementRef;
  @ViewChild('chessboard', { static: true }) chessboard!: ElementRef;

  rows = [0, 1, 2, 3, 4, 5, 6, 7];
  cols = [0, 1, 2, 3, 4, 5, 6, 7];
  board: { [key: string]: string } = {};
  squareSize: number = 0;
  chess = new Chess();
  draggedPiece: { piece: string, from: string } | null = null;
  boardRotation: string = '';
  pieceRotation: string = '';
  currentPlayer: 'w' | 'b' = 'w';

  ngAfterViewInit(): void {
    this.squareSize = this.config.size / 8;
    this.loadFen();
    this.updateBoardRotation();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  loadFen() {
    this.chess.load(this.config.fen);
    this.updateBoard();
  }

  updateBoard() {
    this.board = {};
    const fenBoard = this.chess.board();
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const squareName = this.getSquareName(row, col);
        const piece = fenBoard[row][col];
        if (piece) {
          this.board[squareName] = piece.color + piece.type.toUpperCase();
        }
      }
    }
  }

  getSquareName(row: number, col: number): string {
    const files = 'abcdefgh';
    const ranks = '87654321';
    return files[col] + ranks[row];
  }

  getPieceImage(piece: string): string {
    return `assets/img/chesspiece/${piece}.png`;
  }

  allowDrop(event: any) {
    event.preventDefault();
  }

  drag(event: any, from: string) {
    this.draggedPiece = { piece: event.target.dataset['piece'], from };
    event.dataTransfer.setData('text', event.target.dataset['piece']);
  }

  createMoveObject(from: Square, to: Square): Move {
    const piece = this.chess.get(from);
    if (!piece) {
      throw new Error(`No piece found at ${from}`);
    }
    return {
      from,
      to,
      promotion: 'q',
      piece: piece.type as PieceSymbol,
      color: piece.color,
    } as Move;
  }

  drop(event: any, to: string) {
    event.preventDefault();
    if (!this.draggedPiece) return;

    const from = this.draggedPiece.from as Square;
    const piece = this.draggedPiece.piece;
    this.draggedPiece = null;

    if (from === to) {
      return;
    }
    const toSq = to as Square
    if (this.config.mode === 'game') {
      
      const move = this.createMoveObject(from, toSq);
      if (this.chess.move(move)) {
        this.updateBoard();
        this.switchPlayer();
        this.updateBoardRotation();
      } else {
        this.resetPiecePosition(event, from);
      }
    } else {
      const move = this.createMoveObject(from, toSq);
      this.updateBoard();
    }
  }

  resetPiecePosition(event: any, from: string) {
    const fromSquareElement = this.chessboard.nativeElement.querySelector(`[data-square="${from}"]`);
    const pieceElement = fromSquareElement.querySelector('img');
    if (pieceElement) {
      pieceElement.style.transform = 'translate(0,0)';
    }
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === 'w' ? 'b' : 'w';
  }

  updateBoardRotation() {
    if (this.config.mode === 'game') {
      this.boardRotation = this.currentPlayer === 'w' ? 'rotate(0deg)' : 'rotate(180deg)';
      this.pieceRotation = this.currentPlayer === 'w' ? 'rotate(0deg)' : 'rotate(180deg)';
    } else {
      this.boardRotation = this.config.orientation === 'white' ? 'rotate(0deg)' : 'rotate(180deg)';
      this.pieceRotation = this.config.orientation === 'white' ? 'rotate(0deg)' : 'rotate(180deg)';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.squareSize = this.config.size / 8;
  }
}
