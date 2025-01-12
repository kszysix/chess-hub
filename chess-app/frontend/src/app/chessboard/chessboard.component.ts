import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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
  // ... rest of the component code ...
}
