                                                     
    import { Injectable } from '@angular/core';                                                                                         
                                                                                                                                        
    import {Chess} from 'chess.js';                                                                                                       
                                                                                                                                        
                                                                                                                                        
                                                                                                                                        
    @Injectable({ providedIn: 'root' })                                                                                                 
                                                                                                                                        
    export class ChessService {                                                                                                         
                                                                                                                                        
      private game: Chess;                                                                                                              
                                                                                                                                        
                                                                                                                                        
                                                                                                                                        
      constructor() {                                                                                                                   
                                                                                                                                        
        this.game = new Chess();                                                                                                        
                                                                                                                                        
      }                                                                                                                                 
                                                                                                                                        
                                                                                                                                        
                                                                                                                                        
      // ... methods to interact with chess.js ...                                                                                      
                                                                                                                                        
    }            