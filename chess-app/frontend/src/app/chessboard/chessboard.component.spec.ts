import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChessboardComponent } from './chessboard.component';
import * as Chess from 'chess.js';

describe('ChessboardComponent', () => {
  let component: ChessboardComponent;
  let fixture: ComponentFixture<ChessboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChessboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChessboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the chess game', () => {
    expect(component.game instanceof Chess).toBe(true);
  });

  it('should update the board', () => {
    component.updateBoard();
    expect(component.board.length).toBe(8);
    expect(component.board[0].length).toBe(8);
  });

  it('should make a valid move', () => {
    const initialBoard = component.board;
    component.makeMove('e4'); //Example move
    expect(component.board).not.toEqual(initialBoard);
  });

  it('should not make an invalid move', () => {
    const initialBoard = component.board;
    component.makeMove('e4e4'); //Invalid move
    expect(component.board).toEqual(initialBoard);
  });
});
