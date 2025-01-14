import { Component } from '@angular/core';
import { ChessboardComponent } from './chessboard/chessboard.component';
import { ChessboardComponent2 } from './chess/chessboard.component';
import * as ChessAll from './chess/chessboard.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true, // Add standalone: true
  imports: [ChessboardComponent, ChessboardComponent2] //Import ChessboardComponent here
})
export class AppComponent {
  title = 'frontend';
  boardConfig = {
    size: 400,
    orientation: 'white' as const,
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    mode: 'game' as const
  };
}
