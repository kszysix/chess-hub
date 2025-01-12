import { Component } from '@angular/core';
import { ChessboardComponent } from './chessboard/chessboard.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true, // Add standalone: true
  imports: [ChessboardComponent] //Import ChessboardComponent here
})
export class AppComponent {
  title = 'frontend';
}
