/**
 * Advanced Encounters turn panel buttons.
 *
 * With AE active, a boss actor has two separate combatant entries (Fast + Slow).
 * The factory iterates ALL combatants for the actor and produces a button group
 * per entry, so each entry's buttons hold a direct, safe reference to their
 * specific combatant document.
 *
 * For each combatant entry:
 *   - ToggleTurnSpeedButton    – switches Fast ↔ Slow while not yet activated
 *                                (skipped for boss entries — AE owns their speed)
 *   - StartTurnAdvancedButton  – activates the combatant and sets it as current
 *   - EndTurnAdvancedButton    – advances to the next turn, clearing the current combatant
 */

import { ToggleTurnSpeedButton } from "./toggle-speed-button.js";

const END_TURN_ICON = "modules/enhancedcombathud/icons/duration.webp";

// ---------------------------------------------------------------------------
// Start turn
// ---------------------------------------------------------------------------

class StartTurnAdvancedButton extends CONFIG.ARGON.MAIN.BUTTONS.ActionButton {
    constructor(combatant) {
        super();
        this._combatant = combatant;
    }

    get label() {
        if (this._combatant.isBoss) {
            return this._combatant.turnSpeed === "fast"
                ? "enhancedcombathud-cosmere-rpg.turn.startFast"
                : "enhancedcombathud-cosmere-rpg.turn.startSlow";
        }
        return "enhancedcombathud-cosmere-rpg.turn.start";
    }

    get icon() { return END_TURN_ICON; }

    get colorScheme() { return 4; }

    get visible() {
        return (
            !!game.combat?.started &&
            !this._combatant.activated &&
            game.combat.turn === null && // No other combatant currently playing their turn
            this._allPreviousPhasesActivated(this._combatant)
        );
    }

    /**
     * Returns true when all combatants in phases that precede this combatant's
     * phase have already activated (or the combatant is in phase 0).
     *
     * @param {Combatant} combatant
     * @returns {boolean}
     */
    _allPreviousPhasesActivated(combatant) {
        const myPhase = this._getTurnPhaseIndex(combatant);
        if (myPhase === 0) return true;
        return (game.combat?.turns ?? []).every(
            (c) => this._getTurnPhaseIndex(c) >= myPhase || c.activated
        );
    }

    /**
     * Returns the phase index for a combatant in the Cosmere initiative order.
     *
     * Phase order:
     *   0 – Fast Players
     *   1 – Fast NPCs
     *   2 – Slow Players
     *   3 – Slow NPCs
     *
     * @param {Combatant} combatant
     * @returns {number}
     */
    _getTurnPhaseIndex(combatant) {
        const isCharacter = combatant.actor?.type === "character";
        const isFast = combatant.turnSpeed === "fast";
        if (isFast) 
            return isCharacter ? 0 : 1;
        else 
            return isCharacter ? 2 : 3;
    }

    async _onLeftClick() {
        await this._combatant.markActivated();
        await game.combat.setCurrentTurnFromCombatant(this._combatant);
    }
}

// ---------------------------------------------------------------------------
// End turn
// ---------------------------------------------------------------------------

class EndTurnAdvancedButton extends CONFIG.ARGON.MAIN.BUTTONS.ActionButton {
    constructor(combatant) {
        super();
        this._combatant = combatant;
    }

    get label() {
        if (this._combatant.isBoss) {
            return this._combatant.turnSpeed === "fast"
                ? "enhancedcombathud-cosmere-rpg.turn.endFast"
                : "enhancedcombathud-cosmere-rpg.turn.endSlow";
        }
        return "enhancedcombathud.hud.endturn.name";
    }

    get icon() { return END_TURN_ICON; }

    get colorScheme() { return 4; }

    get visible() {
        return game.combat?.combatant?.id === this._combatant.id;
    }

    async _onLeftClick() {
        await game.combat?.nextTurn();
    }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Build the button set for the Advanced Encounters turn panel.
 *
 * One button group (optional toggle + start + end) is created for every
 * combatant entry belonging to this actor.  Boss entries never get a toggle
 * button because AE controls their speed via separate Fast/Slow entries.
 *
 * @param {Actor} actor
 * @returns {ActionButton[]}
 */
export function buildAdvancedButtons(actor) {
    const combatants = game.combat?.getCombatantsByActor(actor) ?? [];
    const buttons = [];

    for (const combatant of combatants) {
        if (!combatant.isBoss) {
            buttons.push(new ToggleTurnSpeedButton(combatant));
        }
        buttons.push(new StartTurnAdvancedButton(combatant));
        buttons.push(new EndTurnAdvancedButton(combatant));
    }

    return buttons;
}
