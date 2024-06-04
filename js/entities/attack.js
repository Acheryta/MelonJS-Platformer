import * as me from 'melonjs';
import game from './../game.js';

/**
 * not done yet but can use
 */

class AttackEntity extends me.Entity {
    /**
     * constructor
     */
    constructor(x, y, settings) {
        // call the super constructor
        super(x, y,
            Object.assign({
                image: game.texture,
                region : "fire_ball",
                width: 35,
                height: 26,
                shapes :[new me.Ellipse(35 / 2, 22 / 2, 35, 22)] // fire ball are 35x35
            })
        );
        this.body.setMaxVelocity(settings.velX || 5, settings.velY || 0);
        this.alwaysUpdate = true;
        this.body.gravityScale = 0;
        // set time
        this.aliveTime = 100; 
    }

    // add a onResetEvent to enable object recycling
    onResetEvent(x, y, settings) {
        this.shift(x, y);
        this.pos.set(x, y);
        this.body.setMaxVelocity(settings.velX || 5, settings.velY || 0);
        this.aliveTime = 100; // reset time
        
    }

    update(dt){
        // counter time
        this.aliveTime--;
        if (this.aliveTime <= 0) {
            me.game.world.removeChild(this);
        }
        // make it move
        this.body.force.x = this.body.maxVel.x;
        this.body.setCollisionMask(me.collision.types.PLAYER_OBJECT);

        this.body.update(dt);
        return super.update(dt);
    }
    /**
     * collision handling
     * not done anyway
     */
    onCollision(response, other) {
        switch (other.body.collisionType) {
            case me.collision.types.ENEMY_OBJECT:
                if (other.isMovingEnemy) {
                    game.data.score += 250;
                    this.body.setCollisionMask(me.collision.types.NO_OBJECT);
                    me.game.world.removeChild(this);
                }
        }
        return false;
    }
};

export default AttackEntity;
