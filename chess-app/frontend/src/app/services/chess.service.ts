import { Injectable } from '@angular/core';
import { Chess } from 'chess.js';

@Injectable({ providedIn: 'root' })
export class ChessService {
  getPossibleMoves(game: Chess, row: number, col: number): { row: number; col: number }[] {
    const algebraicNotation = this.getAlgebraicNotation(row, col);
    const moves = game.moves({ square: algebraicNotation, verbose: true });
    return moves.map(move => ({
      row: 8 - parseInt(move.to.slice(1)),
      col: move.to.charCodeAt(0) - 97
    }));
  }

  private getAlgebraicNotation(row: number, col: number): string {
    const colName = String.fromCharCode(97 + col);
    return colName + (8 - row);
  }
}
