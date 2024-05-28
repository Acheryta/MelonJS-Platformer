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
        // give some score
        if(game.data.haskey == true){
            game.data.level += 1;
            if(game.data.level == 1){game.data.haskey = false;}
            me.level.load("map"+game.data.level);
        }

        //avoid further collision
        // this.body.setCollisionMask(me.collision.types.NO_OBJECT);

        // me.game.world.removeChild(this);

        return false;
    }
};

export default DoorEntity;
