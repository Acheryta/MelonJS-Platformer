import * as me from 'melonjs';
import game from './../game.js';
import AttackEntity from './attack.js';
class PlayerEntity extends me.Entity {
    constructor(x, y, settings) {
        // call the constructor
        super(x, y , settings);

        // set a "player object" type
        this.body.collisionType = me.collision.types.PLAYER_OBJECT;

        // player can exit the viewport (jumping, falling into a hole, etc.)
        this.alwaysUpdate = true;

        // walking & jumping speed
        this.body.setMaxVelocity(4, 18);
        this.body.setFriction(0.4, 0);

        this.dying = false;
        this.multipleJump = 1;

        this.life = 3;
        this.ishurt = false;
        this.count = 0;
        // set the viewport to follow this renderable on both axis, and enable damping
        me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH, 0.1);

        // enable keyboard
        me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.X,     "jump", true);
        me.input.bindKey(me.input.KEY.UP,    "jump", true);
        me.input.bindKey(me.input.KEY.SPACE, "jump", true);
        me.input.bindKey(me.input.KEY.DOWN,  "down");

        me.input.bindKey(me.input.KEY.A,     "left");
        me.input.bindKey(me.input.KEY.D,     "right");
        me.input.bindKey(me.input.KEY.W,     "jump", true);
        me.input.bindKey(me.input.KEY.S,     "down");
        
        me.input.bindKey(me.input.KEY.J,     "attack");

        me.input.bindKey(me.input.KEY.N,     "next-level");
        //me.input.registerPointerEvent("pointerdown", this, this.onCollision.bind(this));
        //me.input.bindPointer(me.input.pointer.RIGHT, me.input.KEY.LEFT);

        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.FACE_1}, me.input.KEY.UP);
        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.FACE_2}, me.input.KEY.UP);
        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.DOWN}, me.input.KEY.DOWN);
        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.FACE_3}, me.input.KEY.DOWN);
        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.FACE_4}, me.input.KEY.DOWN);
        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.LEFT}, me.input.KEY.LEFT);
        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.RIGHT}, me.input.KEY.RIGHT);

        // map axes
        me.input.bindGamepad(0, {type:"axes", code: me.input.GAMEPAD.AXES.LX, threshold: -0.5}, me.input.KEY.LEFT);
        me.input.bindGamepad(0, {type:"axes", code: me.input.GAMEPAD.AXES.LX, threshold: 0.5}, me.input.KEY.RIGHT);
        me.input.bindGamepad(0, {type:"axes", code: me.input.GAMEPAD.AXES.LY, threshold: -0.5}, me.input.KEY.UP);

        // set a renderable
        this.renderable = game.texture.createAnimationFromName([
            "walk0001", "walk0002", "walk0003",
            "walk0004", "walk0005", "walk0006",
            "walk0007", "walk0008", "walk0009",
            "walk0010", "walk0011",
            "attack0001", "attack0002", "attack0003",
            "attack0004"
        ]);

        // define a basic walking animatin
        this.renderable.addAnimation("stand", [{ name: "walk0001", delay: 100 }]);
        this.renderable.addAnimation("walk",  [{ name: "walk0001", delay: 100 }, { name: "walk0002", delay: 100 }, { name: "walk0003", delay: 100 }]);
        this.renderable.addAnimation("jump",  [{ name: "walk0004", delay: 150 }, { name: "walk0005", delay: 150 }, { name: "walk0006", delay: 150 }, { name: "walk0002", delay: 150 }, { name: "walk0001", delay: 150 }]);
        this.renderable.addAnimation("attack", [{ name: "attack0001", delay: 50 }, { name: "attack0002", delay: 50 }, { name: "attack0003", delay: 50 }, { name: "attack0004", delay: 50 }]);

        // set as default
        this.renderable.setCurrentAnimation("stand");

        // set the renderable position to bottom center
        this.anchorPoint.set(0.5, 0.5);
    }

    /**
     ** update the force applied
     */
    update(dt) {
        if(this.ishurt == true) {
            this.count += 1;
            if(this.count == 50){
                this.ishurt = false;
                this.count = 0;
            }
        }
        if (me.input.isKeyPressed("left")){
            if (this.body.vel.y === 0) {
                this.renderable.setCurrentAnimation("walk");
            }
            this.body.force.x = -this.body.maxVel.x;
            this.renderable.flipX(true);
        } else if (me.input.isKeyPressed("right")) {
            if (this.body.vel.y === 0) {
                this.renderable.setCurrentAnimation("walk");
            }
            this.body.force.x = this.body.maxVel.x;
            this.renderable.flipX(false);
        }

        if (me.input.isKeyPressed("jump")) {
            if (this.multipleJump < 2) {
                // easy "math" for double jump
                this.renderable.setCurrentAnimation("jump");
                this.body.force.y = -this.body.maxVel.y * this.multipleJump;
                this.body.jumping = true;
                this.multipleJump++;
                me.audio.stop("jump");
                me.audio.play("jump", false);
            }
        }
        if(this.body.vel.y === 0){
            this.multipleJump = 1;
        }

        if(me.input.isKeyPressed("next-level")){
            game.data.level += 1;
            if(game.data.level > 2){
                game.data.level = 0;
                me.level.load("map0");
            }
            else{
                me.level.load("map"+game.data.level);
            }
        }
        // if (me.input.isKeyPressed("jump")) {
        //     this.renderable.setCurrentAnimation("jump");
        //     this.body.jumping = true;
        //     if (this.multipleJump < 2) {
        //         // easy "math" for double jump
        //         this.body.force.y = -this.body.maxVel.y;
        //         this.multipleJump += 1;
        //         console.log(this.multipleJump)
        //         me.audio.stop("jump");
        //         me.audio.play("jump", false);
        //     }
        // } else {
        //     if (!this.body.falling && !this.body.jumping) {
        //         // reset the multipleJump flag if on the ground
        //         console.log(this.multipleJump)
        //         this.multipleJump = 0;
        //     }
        //     else if (this.body.falling && this.multipleJump < 2) {
        //         // reset the multipleJump flag if falling
        //         this.multipleJump = 2;
        //     }
        // }

        
        if (this.body.force.x === 0 && this.body.force.y === 0) {
            this.renderable.setCurrentAnimation("stand");
        }
        if (me.input.isKeyPressed("attack")){
            this.renderable.setCurrentAnimation("attack");
            this.doAttack();
        }
        // check if we fell into a hole or no more life
        if ((!this.inViewport && (this.getBounds().top > me.video.renderer.height)) || game.data.health == 0) {
            // if yes reset the game
            me.game.world.removeChild(this);
            game.data.score = 0;
            game.data.health = 3;
            game.data.haskey = true;
            game.data.level = 0;
            me.game.viewport.fadeIn("#fff", 150, function(){
                me.audio.play("die", false);
                me.level.load('map0');
                me.game.viewport.fadeOut("#fff", 150);
            });
            return true;
        }

        // check if we moved (an "idle" animation would definitely be cleaner)
        if (this.body.vel.x !== 0 || this.body.vel.y !== 0 ||
            (this.renderable && this.renderable.isFlickering())
        ) {
            super.update(dt);
            return true;
        }
        return false;
    }


    /**
     * colision handler
     */
    onCollision(response, other) {
        switch (other.body.collisionType) {
            case me.collision.types.WORLD_SHAPE:
                // Simulate a platform object
                if (other.type === "platform") {
                    if (this.body.falling &&
                        !me.input.isKeyPressed("down") &&
                        // Shortest overlap would move the player upward
                        (response.overlapV.y > 0) &&
                        // The velocity is reasonably fast enough to have penetrated to the overlap depth
                        (~~this.body.vel.y >= ~~response.overlapV.y)
                    ) {
                        // Disable collision on the x axis
                        response.overlapV.x = 0;
                        // Repond to the platform (it is solid)
                        return true;
                    }
                    // Do not respond to the platform (pass through)
                    return false;
                }

                // Custom collision response for slopes
                else if (other.type === "slope") {
                    // Always adjust the collision response upward
                    response.overlapV.y = Math.abs(response.overlap);
                    response.overlapV.x = 0;

                    // Respond to the slope (it is solid)
                    return true;
                }
                break;

            case me.collision.types.ENEMY_OBJECT:
                if (!other.isMovingEnemy) {
                    if(this.ishurt == false){
                        // spike or any other fixed danger
                        this.body.vel.y -= this.body.maxVel.y + 500;
                        this.body.vel.x -= this.body.maxVel.x + 500;
                        this.hurt();
                        
                    }
                }
                else {
                    // a regular moving enemy entity
                    if ((response.overlapV.y > 0) && this.body.falling) {
                        // jump
                        this.body.vel.y -= this.body.maxVel.y * 1.5 * me.timer.tick;
                    }
                    else {
                        if(this.ishurt == false){
                            this.body.vel.y -= this.body.maxVel.y + 500;
                            this.body.vel.x -= this.body.maxVel.x + 500;
                            this.hurt();
                        }
            
                    }
                    // Not solid
                    return false;
                }
                break;

            default:
                // Do not respond to other objects (e.g. coins)
                return false;
        }

        // Make the object solid
        return true;
    }

    /**
     * ouch
     */
    hurt() {
        var sprite = this.renderable;
        this.life -= 1;
        game.data.health -= 1;
        this.ishurt = true;
        if (!sprite.isFlickering()) {

            // tint to red and flicker
            sprite.tint.setColor(255, 192, 192);
            sprite.flicker(750, function () {
                // clear the tint once the flickering effect is over
                sprite.tint.setColor(255, 255, 255);
            });

            // flash the screen
            me.game.viewport.fadeIn("#FFFFFF", 75);
            me.audio.play("die", false);
        }
    }

    doAttack(){
        const attackSettings = {
            width: 50, // Chiều rộng của thực thể tấn công
            height: 50, // Chiều cao của thực thể tấn công
            velX: this.renderable.flipX ? -5 : 5, // Vận tốc theo trục x tùy thuộc vào hướng của người chơi
            velY: 0 // Vận tốc theo trục y
            // Các thuộc tính khác nếu cần
        };
        // Lấy vị trí hiện tại của người chơi
        const x = this.pos.x + (this.renderable.flipX ? + 2*attackSettings.width : this.width);
        const y = this.pos.y+60;
        let attack = me.pool.pull("AttackEntity", x, y, attackSettings);
        // attack.reset(x, y, attackSettings); // Đặt lại thực thể tấn công
        me.game.world.addChild(attack);
    }
};

export default PlayerEntity;
