export default class CosmereMovementHUD extends CONFIG.ARGON.MovementHud {
    constructor(...args) {
        super(...args);
        this.getMovementMode = game.modules.get("elevation-drag-ruler")?.api?.getMovementMode;
    }
    get visible() {
        return game.combat?.started;
    }

    get movementMode() {
        return this.getMovementMode ? this.getMovementMode(this.token) : "walk";
    }

    get movementMax() {
        if (!this.actor) return 0;
        return this.actor.system.movement[this.movementMode].rate.value
            / canvas.scene.dimensions.distance;
    }

}