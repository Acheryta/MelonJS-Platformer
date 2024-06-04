import * as me from 'melonjs';
import game from './../game.js';

/**
 * a basic control to toggle fullscreen on/off
 */
class FSControl extends me.UISpriteElement {
    /**
     * constructor
     */
    constructor(x, y) {
        super(x, y, {
            image: game.texture,
            region : "shadedDark30"
        });
        this.setOpacity(0.5);
        this.floating = false;
    }

    /**
     * function called when the pointer is over the object
     */
    onOver(/* event */) {
        this.setOpacity(1.0);
    }

    /**
     * function called when the pointer is leaving the object area
     */
    onOut(/* event */) {
        this.setOpacity(0.5);
    }

    /**
     * function called when the object is clicked on
     */
    onClick(/* event */) {
        if (!me.device.isFullscreen()) {
            me.device.requestFullscreen();
        } else {
            me.device.exitFullscreen();
        }
        return false;
    }
};

/**
 * a basic control to toggle audio on/off
 */
class AudioControl extends me.UISpriteElement {
    /**
     * constructor
     */
    constructor(x, y) {
        super(x, y, {
            image: game.texture,
            region : "shadedDark13" // ON by default
        });
        this.setOpacity(0.5);
        this.isMute = false;
        this.floating = false;
    }

    /**
     * function called when the pointer is over the object
     */
    onOver(/* event */) {
        this.setOpacity(1.0);
    }

    /**
     * function called when the pointer is leaving the object area
     */
    onOut(/* event */) {
        this.setOpacity(0.5);
    }

    /**
     * function called when the object is clicked on
     */
    onClick(/* event */) {
        if (this.isMute) {
            me.audio.unmuteAll();
            this.setRegion(game.texture.getRegion("shadedDark13"));
            this.isMute = false;
        } else {
            me.audio.muteAll();
            this.setRegion(game.texture.getRegion("shadedDark15"));
            this.isMute = true;
        }
        return false;
    }
};

/**
 * a basic HUD item to display score
 */
class ScoreItem extends me.BitmapText {
    /**
     * constructor
     */
    constructor(x, y) {
        // call the super constructor
        super(
            me.game.viewport.width  + x,
            me.game.viewport.height + y,
            {
                font : "PressStart2P",
                textAlign : "right",
                textBaseline : "bottom",
                text : "Point 0"
            }
        );

        this.relative = new me.Vector2d(x, y);

        this.floating = false;

        // local copy of the global score
        this.score = -1;

        // recalculate the object position if the canvas is resize
        me.event.on(me.event.CANVAS_ONRESIZE, (function(w, h){
            this.pos.set(w, h, 0).add(this.relative);
        }).bind(this));
    }

    /**
     * update function
     */
    update( dt ) {
        if (this.score !== game.data.score) {
            this.score = game.data.score;
            this.setText("Point " + this.score);
            this.isDirty = true;
        }
        return super.update(dt);
    }
};

class Health extends me.UISpriteElement {
    /**
     * constructor
     */
    constructor(x, y) {
        // call the super constructor
        super(me.game.viewport.width  + x,y,
            {
                image: game.texture,
                region : "heart-3"
            }
        );

        this.relative = new me.Vector2d(x, y);

        this.floating = false;

        // local copy of the global health
        this.health = 3;

        // recalculate the object position if the canvas is resize
        me.event.on(me.event.CANVAS_ONRESIZE, (function(w, h){
            this.pos.set(w, 0, 0).add(this.relative);
        }).bind(this));
    }

    /**
     * update function
     */
    update( dt ) {
        if (this.health !== game.data.health) {
            this.health = game.data.health;
            switch(this.health){
                case 1:
                    this.setRegion(game.texture.getRegion("heart-1"));
                    break;
                case 2:
                    this.setRegion(game.texture.getRegion("heart-2"));
                    break;
                case 3:
                    this.setRegion(game.texture.getRegion("heart-3"));
                    break;
                default:
            }
        }
        return super.update(dt);
    }
};

/**
 * a HUD container and child items
 */
class UIContainer extends me.Container {

    constructor() {
        // call the constructor
        super();

        // persistent across level change
        this.isPersistent = true;

        // Use screen coordinates
        this.floating = true;

        // make sure our object is always draw first
        this.z = Infinity;

        // give a name
        this.name = "HUD";

        // add our child score object at position
        this.addChild(new ScoreItem(-10, -10));
        this.addChild(new Health(-120, 60));
        // add our audio control object
        this.addChild(new AudioControl(36, 56));

        if (!me.device.isMobile) {
            // add our fullscreen control object
            this.addChild(new FSControl(36 + 10 + 48, 56));
        }
    }
};

export default UIContainer;
