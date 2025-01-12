import { Component, OnInit, standalone } from '@angular/core'; //Import standalone
import * as Chess from 'chess.js';

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
    }
    .white {
      background-color: #f0d9b5;
    }
    .black {
      background-color: #b58863;
    }
  `],
  standalone: true // Add standalone: true
})
export class ChessboardComponent implements OnInit {
  // ... rest of the component code ...
}
