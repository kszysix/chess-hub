import { Component, OnInit } from "@angular/core";
import { Chess } from "chess.js";
import * as ChessJS from "chess.js";

@Component({
  // ... other component metadata ...
  templateUrl: './chessboard.component.html'
})
export class ChessboardComponent implements OnInit {
  // ... other component properties and methods ...
  game: Chess = new Chess();
  board: string[][] = [][];
  ngOnInit(): void {
    // Initialization logic here
    this.board = this.game.board();
  }

  getPieceImage(piece: string): string {
    const color = piece[1];
    const type = piece[0].toUpperCase(); // Ensure uppercase for consistency
    return `/assets/img/chesspieces/${color}${type}.png`;
  }
}
