/**
 * Basic (non–Advanced Encounters) turn panel buttons.
 *
 * For non-boss actors:
 *   - ToggleTurnSpeedBasicButton  – switches Fast ↔ Slow while not yet activated
 *   - EndTurnBasicButton          – marks the combatant as activated
 *
 * For boss actors (single combatant entry, two activation flags):
 *   - BossSlowEndTurnBasicButton  – extends EndTurnBasicButton; marks slow turn done
 *   - BossFastEndTurnBasicButton  – extends EndTurnBasicButton; marks fast turn done
 */

import { ToggleTurnSpeedButton } from "./toggle-speed-button.js";

const END_TURN_ICON = "modules/enhancedcombathud/icons/duration.webp";

// ---------------------------------------------------------------------------
// End-turn base (shared icon, colorScheme, and combat-started guard)
// ---------------------------------------------------------------------------

class EndTurnBasicButton extends CONFIG.ARGON.MAIN.BUTTONS.ActionButton {
    constructor(combatant) {
        super();
        this._combatant = combatant;
    }

    get label() { return "enhancedcombathud.hud.endturn.name"; }

    get icon() { return END_TURN_ICON; }

    get colorScheme() { return 4; }

    get visible() {
        return !!game.combat?.started && !this._combatant.activated;
    }

    async _onLeftClick() {
        await this._combatant.markActivated();
    }

    get template() {
        // Required due to template being by default computed from the immediate parent class name
        return "modules/enhancedcombathud/templates/partials/ActionButton.hbs";
    }
}

// ---------------------------------------------------------------------------
// Boss helpers – extend the base, override only what differs
// ---------------------------------------------------------------------------
class BossFastEndTurnBasicButton extends EndTurnBasicButton {
    get label() { return "enhancedcombathud-cosmere-rpg.turn.endFast"; }
    get visible() { return !!game.combat?.started && !this._combatant.bossFastActivated; }
    async _onLeftClick() { await this._combatant.markActivated(true); }
}

class BossSlowEndTurnBasicButton extends EndTurnBasicButton {
    get label() { return "enhancedcombathud-cosmere-rpg.turn.endSlow"; }
    // visible: same as base – hidden once .activated is set
    async _onLeftClick() { await this._combatant.markActivated(false); }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Build the button set for the basic (non-AE) turn panel.
 *
 * @param {Actor} actor
 * @returns {ActionButton[]}
 */
export function buildBasicButtons(actor) {
    const combatant = game.combat?.getCombatantsByActor(actor)?.[0];
    if (!combatant) return [];

    if (combatant.isBoss) {
        return [
            new BossFastEndTurnBasicButton(combatant),
            new BossSlowEndTurnBasicButton(combatant),
        ];
    }

    return [
        new ToggleTurnSpeedButton(combatant),
        new EndTurnBasicButton(combatant),
    ];
}
