import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { ChessboardComponent } from './chessboard/chessboard.component';
import { ChessboardComponent2 } from './chess/chessboard.component';

@NgModule({
  declarations: [
    
  ],
  imports: [
    BrowserModule,
    ChessboardComponent, // Import ChessboardComponent here
    AppComponent,
    CommonModule,
    ChessboardComponent2
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
