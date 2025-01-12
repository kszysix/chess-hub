import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ChessboardComponent } from './chessboard/chessboard.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ChessboardComponent // Import ChessboardComponent here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
