/**
 * Shared turn-speed toggle button used by both the basic and advanced turn panels.
 *
 * Renders a CSS-variable-driven SVG icon (fast/slow) and calls
 * combatant.toggleTurnSpeed() on click.  Hidden once the combatant has activated.
 */
export class ToggleTurnSpeedButton extends CONFIG.ARGON.MAIN.BUTTONS.ActionButton {
    constructor(combatant) {
        super();
        this._combatant = combatant;
    }

    get label() {
        return "COSMERE.Combat.ToggleTurn";
    }

    get colorScheme() { return 4; }

    get visible() {
        return !!game.combat?.started && !this._combatant.activated;
    }

    async _renderInner() {
        await super._renderInner();
         // Argon always add a background image, but ours is in CSS
        this.element.style.backgroundImage = "";
        this.element.classList.remove("toggle-turn-speed-button-fast", "toggle-turn-speed-button-slow");
        this.element.classList.add(`toggle-turn-speed-button-${this._combatant.turnSpeed}`);
    }

    async _onLeftClick() {
        // The hover icon show the opposite speed, so we don't want to show it after the click.
        this.element.classList.add("suppress-hover");
        this.element.addEventListener("mouseleave", () => {
            this.element.classList.remove("suppress-hover");
        }, { once: true });

        await this._combatant.toggleTurnSpeed();
    }
}
