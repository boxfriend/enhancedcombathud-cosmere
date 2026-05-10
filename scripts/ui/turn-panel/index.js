/**
 * CosmereTurnPanel – replaces the stock PassTurnPanel with Cosmere-aware
 * turn management buttons.
 *
 * When the cosmere-advanced-encounters module is active the panel delegates to
 * the advanced button factory; otherwise it falls back to the basic factory.
 */

import { buildAdvancedButtons } from "./advanced.js";
import { buildBasicButtons } from "./basic.js";

const ADVANCED_ENCOUNTERS_ID = "cosmere-advanced-encounters";

export class CosmereTurnPanel extends CONFIG.ARGON.PREFAB.PassTurnPanel {
    get label() {
        return "enhancedcombathud-cosmere-rpg.turn.panel";
    }

    get template() {
        // Required due to template being by default computed from the immediate parent class name
        return "modules/enhancedcombathud/templates/partials/ActionPanel.hbs";
    }

    async _getButtons() {
        if (game.modules.get(ADVANCED_ENCOUNTERS_ID)?.active) {
            return buildAdvancedButtons(this.actor);
        }
        return buildBasicButtons(this.actor);
    }
}
