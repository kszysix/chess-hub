import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ChessboardComponent } from './chessboard/chessboard.component';

@NgModule({
  declarations: [
    AppComponent,
    ChessboardComponent // Ensure ChessboardComponent is declared here
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
