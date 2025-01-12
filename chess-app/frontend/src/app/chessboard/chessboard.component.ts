// ... other imports ...

@Component({
  // ... other component metadata ...
})
export class ChessboardComponent implements OnInit {
  // ... other component properties and methods ...

  getPieceImage(piece: string): string {
    const color = piece[1];
    const type = piece[0].toUpperCase(); // Ensure uppercase for consistency
    return `/assets/img/chesspieces/${color}${type}.png`;
  }
}
