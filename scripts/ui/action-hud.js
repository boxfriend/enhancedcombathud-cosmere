import { COMPENDIUM_BASIC_ACTIONS, WORLD_BASIC_ACTIONS, MODULE_ID } from '../utilities.js';
import { CosmereItemButton } from './buttons/cosmere-item-button.js';
import { CosmereButtonPanelButton } from './buttons/cosmere-button-panel-button.js';
import { RemovableMacroButton } from './buttons/removable-macro-button.js';

const BUTTONS = CONFIG.ARGON.MAIN.BUTTONS;

export default class CosmereActionHUD extends CONFIG.ARGON.MAIN.ActionPanel {

    get actionType() { return 'act'; }

    get label() {
        switch(this.actionType) {
            case 'act':
                return "Actions";
            case 'fre':
                return "Free Actions";
            case 'rea':
                return "Reactions";
            case 'spe':
                return "Special";
            default:
                return "UNKNOWN";
        }
    }

    async _getButtons() {
        const buttons = [];

        if(this.actionType === 'act') {
            for(let i = 1; i <= 3; i++) {
                const actions = this.#getActions('act', i);
                buttons.push(new CosmereButtonPanelButton(actions, i, 'act'));
            }
        }
        else {
            buttons.push(new CosmereButtonPanelButton(this.#getActions(this.actionType, 0), 0, this.actionType));
        }

        if(game.settings.get(MODULE_ID, "showEmptyPanel"))
            return buttons;

        return buttons.filter(button => button.actions?.length > 0);
    }

    get template() { return new CONFIG.ARGON.MAIN.ActionPanel().template; }

    #getActionsFilter(action, actionType, actionCost) {
        const system = action.system;
        return system.activation?.cost?.type === actionType
            && this.#notBasicStrikeAction(action)
            && this.#notWeaponStrikeAction(action)
            && (actionType !== 'act' || (actionType === 'act'
                && system.activation?.cost?.value === actionCost));
    }

    #notBasicStrikeAction(action) {
        return action.name !== 'Strike'
            && action.system.id !== 'unarmed-strike' 
            && action.system.id !== 'unarmed-attack';
    }

    #notWeaponStrikeAction(action) {
        const parent = action.parent;

        // if it has no parent then we obviously don't need to check it
        if(!parent) return true;

        if(parent.type === 'weapon' && action.system.id.startsWith('strike-'))
            return false;

        return true;
    }

    #getActions(actionType, actionCost) {
        let actions = this.actor.actions.filter(item => this.#getActionsFilter(item, actionType, actionCost));

        const includeWorld = game.settings.get(MODULE_ID, "includeWorldBasicActions");
        if(includeWorld)
            actions = actions.concat(Array.from(WORLD_BASIC_ACTIONS).filter(item => this.#getActionsFilter(item, actionType, actionCost)));

        const includeBasic = game.settings.get(MODULE_ID, "includeBasicActions");
        if(includeBasic)
            actions = actions.concat(Array.from(COMPENDIUM_BASIC_ACTIONS).filter(item => this.#getActionsFilter(item, actionType, actionCost)));

        actions = this.#filterDuplicates(actions);
        const macroCost = this.#getMacroCost(actionType, actionCost);
        const macros = this.actor.getFlag(MODULE_ID, `macros.${macroCost}`) || [];
        actions.push(...macros.map(id => game.macros.get(id)));

        return actions;
    }

    #getMacroCost(actionType, actionCost) {
        switch(actionType) {
            case 'act':
                return "▶".repeat(actionCost);
            case 'fre':
                return "▷";
            case 'rea':
                return "↩";
            case 'spe':
                return "★";
            default:
                return "UNKNOWN";
        }
    }

    #filterDuplicates(array) {
        const set = new Set();
        return array.filter(item => {
            if(set.has(item.name)) return false;
            set.add(item.name);
            return true;
        });
    }
}

