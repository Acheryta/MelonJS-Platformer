import * as me from 'melonjs';
import game from './../game.js';

class DoorEntity extends me.Collectable {
    /**
     * constructor
     */
    constructor(x, y, settings) {
        // call the super constructor
        super(x, y,
            Object.assign({
                image: game.texture,
                region : "invisible",
                shape: [new me.Rect(0,0,60,100)]
            })
        );
    }

    // add a onResetEvent to enable object recycling
    onResetEvent(x, y, settings) {
        this.shift(x, y);
        // only check for collision against player
        this.body.setCollisionMask(me.collision.types.PLAYER_OBJECT);
    }

    /**
     * collision handling
     */
    onCollision(/*response*/) {

        // do something when collide
        // me.audio.play("cling", false);
        
        // get to next map
        if(game.data.haskey == true){
            game.data.level += 1;
            if(game.data.level == 1){game.data.haskey = false;}
            if(game.data.level == 3){game.data.level = 0;}
            me.level.load("map"+game.data.level);
        }


        return false;
    }
};

export default DoorEntity;
