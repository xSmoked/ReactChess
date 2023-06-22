
import {PieceType, TeamType, samePosition} from "../Constants";

export default class Referee {

    tileIsEmptyOrOccupiedByOpponent(desiredPosition, team, boardPieces){
        return !this.tileIsOccupied(desiredPosition, boardPieces) || this.tileIsOccupiedByOpponent(desiredPosition, team, boardPieces);
    }

    tileIsOccupied(desiredPosition, boardPieces){
        return boardPieces.find(elem => samePosition(elem.position, desiredPosition)) !== undefined;
    }

    tileIsOccupiedByOpponent(desiredPosition, team, boardPieces){
        return boardPieces.find(elem => samePosition(elem.position, desiredPosition) && elem.team !== team) !== undefined;
    }

    isEnPassantMove(initialPosition, desiredPosition, pieceType, team, boardPieces){

        const direction = team === TeamType.player ? 1 : -1;
        
        if(pieceType === PieceType.pawn){

            //Checking if the piece moved left or right
            if((desiredPosition.x - initialPosition.x === -1 || desiredPosition.x - initialPosition.x === 1) && desiredPosition.y - initialPosition.y === direction){

                //Return true if the piece's enPassant flag is true and the piece is in the correct position
                return boardPieces.find((elem) => samePosition(elem.position, {x: desiredPosition.x, y: desiredPosition.y - direction}) && elem.enPassant) !== undefined;
            }
        }

        return false;
    }

    isValidMove(initialPosition, desiredPosition, pieceType, team, boardPieces){

        if(pieceType === PieceType.pawn){
            const firstRow = (team === TeamType.player) ? 1 : 6;
            const direction = (team === TeamType.player) ? 1 : -1;
            
            if(initialPosition.x === desiredPosition.x && desiredPosition.y - initialPosition.y === 2 * direction && initialPosition.y === firstRow){
                if(!this.tileIsOccupied(desiredPosition, boardPieces) && !this.tileIsOccupied({x: desiredPosition.x, y: desiredPosition.y - direction}, boardPieces)){
                    return true;
                }
            }
            else if(initialPosition.x === desiredPosition.x && desiredPosition.y - initialPosition.y === direction){
                if(!this.tileIsOccupied(desiredPosition, boardPieces)){
                    return true;
                }
            }
            //Diagonal capture
            else if(desiredPosition.x - initialPosition.x === -1 && desiredPosition.y - initialPosition.y === direction){
                if(this.tileIsOccupiedByOpponent(desiredPosition, team, boardPieces)){
                    return true;
                }
            }
            else if(desiredPosition.x - initialPosition.x === 1 && desiredPosition.y - initialPosition.y === direction){
                if(this.tileIsOccupiedByOpponent(desiredPosition, team, boardPieces)){
                    return true;
                }
            }
        }//end pawn
        else if(pieceType === PieceType.knight){
            const moveHorizontal = Math.abs(desiredPosition.x - initialPosition.x) === 2 && Math.abs(desiredPosition.y - initialPosition.y) === 1;
            const moveVertical = Math.abs(desiredPosition.x - initialPosition.x) === 1 && Math.abs(desiredPosition.y - initialPosition.y) === 2;
            
            if((moveVertical || moveHorizontal) && this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, team, boardPieces)){
                return true;
            }
        }//end knight
        else if(pieceType === PieceType.bishop){
            //Movement and attack logic
            for(let i = 1; i < 8; i++){
                //Moving up and right
                if(desiredPosition.x > initialPosition.x && desiredPosition.y > initialPosition.y){
                    let passedPosition = {x: initialPosition.x + i, y: initialPosition.y + i};

                    if(samePosition(passedPosition, desiredPosition)){
                        //Dealing with the destination tile
                        if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition, team, boardPieces)){
                            return true;
                        }
                    }
                    else {
                        //If the passed tile is occupied by a piece, break out of the loop
                        if(this.tileIsOccupied(passedPosition, boardPieces)){
                            break;
                        }
                    }
                }

                //Moving up and left
                if(desiredPosition.x < initialPosition.x && desiredPosition.y > initialPosition.y){
                    let passedPosition = {x: initialPosition.x - i, y: initialPosition.y + i};

                    if(samePosition(passedPosition, desiredPosition)){
                        //Dealing with the destination tile
                        if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition, team, boardPieces)){
                            return true;
                        }
                    }
                    else {
                        //If the passed tile is occupied by a piece, break out of the loop
                        if(this.tileIsOccupied(passedPosition, boardPieces)){
                            break;
                        }
                    }
                }

                //Moving down and right
                if(desiredPosition.x > initialPosition.x && desiredPosition.y < initialPosition.y){
                    let passedPosition = {x: initialPosition.x + i, y: initialPosition.y - i};

                    if(samePosition(passedPosition, desiredPosition)){
                        //Dealing with the destination tile
                        if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition, team, boardPieces)){
                            return true;
                        }
                    }
                    else {
                        //If the passed tile is occupied by a piece, break out of the loop
                        if(this.tileIsOccupied(passedPosition, boardPieces)){
                            break;
                        }
                    }
                }

                //Moving down and left
                if(desiredPosition.x < initialPosition.x && desiredPosition.y < initialPosition.y){
                    let passedPosition = {x: initialPosition.x - i, y: initialPosition.y - i};
                    if(samePosition(passedPosition, desiredPosition)){
                        //Dealing with the destination tile
                        if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition, team, boardPieces)){
                            return true;
                        }
                    }
                    else {
                        //If the passed tile is occupied by a piece, break out of the loop
                        if(this.tileIsOccupied(passedPosition, boardPieces)){
                            break;
                        }
                    }
                }
            }//end for
        }//end bishop

        return false;
    }
}
