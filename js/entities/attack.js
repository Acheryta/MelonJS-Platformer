import * as me from 'melonjs';
import game from './../game.js';

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
                shapes :[new me.Ellipse(35 / 2, 22 / 2, 35, 22)] // coins are 35x35
            })
        );
        this.body.setMaxVelocity(settings.velX || 5, settings.velY || 0);
        this.alwaysUpdate = true;
        this.body.gravityScale = 0;
        // Thiết lập thời gian tồn tại của đòn tấn công
        this.aliveTime = 100; // Ví dụ: tồn tại trong 30 frame
    }

    // add a onResetEvent to enable object recycling
    // Override phương thức onResetEvent để đặt lại đối tượng khi được kéo từ pool
    onResetEvent(x, y, settings) {
        this.shift(x, y);
        this.pos.set(x, y);
        this.body.setMaxVelocity(settings.velX || 5, settings.velY || 0);
        this.aliveTime = 100; // Đặt lại thời gian tồn tại
        
    }

    update(dt){
        // Giảm thời gian tồn tại
        this.aliveTime--;
        if (this.aliveTime <= 0) {
            me.game.world.removeChild(this);
        }
        this.body.force.x = this.body.maxVel.x;
        this.body.setCollisionMask(me.collision.types.PLAYER_OBJECT);
        // Cập nhật vị trí dựa trên vận tốc
        this.body.update(dt);
        
        // Gọi update của lớp cha
        return super.update(dt);
    }
    /**
     * collision handling
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
