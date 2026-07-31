import { COMPENDIUM_BASIC_ACTIONS, WORLD_BASIC_ACTIONS, MODULE_ID } from '../utilities.js';
import { CosmereItemButton, RemovableMacroButton, CosmereButtonPanelButton } from './action-buttons.js'

const BUTTONS = CONFIG.ARGON.MAIN.BUTTONS;

export default class CosmereActionHUD extends CONFIG.ARGON.MAIN.ActionPanel {
    //get actionCost() { return 1; }
    //get actionType() { return 'act'; }

    get label() {
        // switch(this.actionType) {
        //     case 'act':
        //         return "▶".repeat(this.actionCost);
        //     case 'fre':
        //         return "▷";
        //     case 'rea':
        //         return "↩";
        //     case 'spe':
        //         return "★";
        //     default:
        //         return "UNKNOWN";
        // }
        return "Actions";
    }

    #getActionsFilter(action, actionType, actionCost) {
        const system = action.system;
        return !this.#isHidden(action) 
            && system.activation?.cost?.type === actionType
            && this.#notStrike(action)
            && this.#parentCheck(action)
            && (actionType !== 'act' || (actionType === 'act'
                && system.activation?.cost?.value === actionCost));
    }

    #notStrike(action) {
        return action.name !== 'Strike'
            && action.system.id !== 'unarmed-strike' 
            && action.system.id !== 'unarmed-attack';
    }

    #parentCheck(action) {
        const item = action.parent;

        // if it has no parent then we obviously don't need to check it
        if(!item) return true;

        if(!this.#validEquip(item)) return false;

        // gotta ignore the auto-generated weapon Strike actions
        if(item.type === 'weapon' && action.system.id.startsWith('strike-'))
            return false;

        return true;
    }

    #validEquip(item) {
        const system = item.system;
        return system.alwaysEquipped 
            // Not equippable at all
            || !system.equippableEnabled
            // Equippable and actually equipped
            || (system.equippableEnabled && system.equipped);

    }

    #isHidden(item) {
        const hidden = this.actor.getFlag(MODULE_ID, "hiddenItems") || [];
        return hidden.includes(item.id);
    }

    async _getButtons() {
        const buttons = [];
        for(let i = 1; i <= 3; i++) {
            const actions = this.#getActionButton('act', i);
            //if(actions && actions.length > 0)
                buttons.push(new CosmereButtonPanelButton(actions, i, 'act'));
        }

        buttons.push(new CosmereButtonPanelButton(this.#getActionButton('fre', 0), 0, 'fre'));
        buttons.push(new CosmereButtonPanelButton(this.#getActionButton('spe', 0), 0, 'spe'));

        return buttons;
    }

    #getActionButton(actionType, actionCost) {
        let actions = this.actor.actions.filter(item => this.#getActionsFilter(item, actionType, actionCost));

        const includeWorld = game.settings.get(MODULE_ID, "includeWorldBasicActions");
        if(includeWorld)
            actions = actions.concat(Array.from(WORLD_BASIC_ACTIONS).filter(item => this.#getActionsFilter(item, actionType, actionCost)));

        const includeBasic = game.settings.get(MODULE_ID, "includeBasicActions");
        if(includeBasic)
            actions = actions.concat(Array.from(COMPENDIUM_BASIC_ACTIONS).filter(item => this.#getActionsFilter(item, actionType, actionCost)));

        actions = this.#filterDuplicates(actions);
        const macros = this.actor.getFlag(MODULE_ID, `macros.${this.label}`) || [];
        actions.push(...macros.map(id => game.macros.get(id)));

        return actions;

        // if(actions && actions.length === 1)
        //     return [new CosmereItemButton({
        //         item: actions[0],
        //         actionCost: this.actionCost,
        //         inActionPanel: true,
        //     })];

        // if(actions && actions.length % 2 !== 0)
        //     actions.push(null);


        // const buttons = [];

        // actions.forEach(item => {
        //     if(item) {
        //         if (item.type !== 'script' || item.type !== 'chat') {
        //             buttons.push(new CosmereItemButton({
        //                 item: item,
        //                 actionCost: this.actionCost,
        //                 inActionPanel: true,
        //             }));
        //         } else {
        //             buttons.push(new RemovableMacroButton({
        //                 macro: item,
        //                 inActionPanel: true,
        //                 parent: this.label,
        //             }));
        //         }
        //     } else {
        //         buttons.push(new BUTTONS.ActionButton());
        //     }
        // });

        // const splitButtons = [];
        // for(let i = 0; i < buttons.length; i += 2) {
        //     const first = buttons[i];
        //     const second = buttons[i + 1];
        //     splitButtons.push(new BUTTONS.SplitButton(first, second));
        // }

        // if(splitButtons.length === 0) {
        //     const showEmpty = game.settings.get(MODULE_ID, "showEmptyPanel");
        //     if(showEmpty) splitButtons.push(new BUTTONS.ActionButton());
        // }
        // return splitButtons;
    }

    #filterDuplicates(array) {
        const set = new Set();
        return array.filter(item => {
            if(set.has(item.name)) return false;
            set.add(item.name);
            return true;
        });
    }

    get template() { return new CONFIG.ARGON.MAIN.ActionPanel().template; }
    // async activateListeners(html) {
    //     super.activateListeners(html);
    //     this.element.addEventListener("drop", this._onDrop.bind(this));

    // }

    // async _onDrop(event) {
    //     console.log("drop", event);
    //     try {
    //         event.preventDefault();
    //         event.stopPropagation();
    //         const data = JSON.parse(event.dataTransfer.getData("text/plain"));
    //         if (data?.type !== "Macro") return;
    //         const macro = game.macros.get(data.uuid.replace("Macro.", ""));
    //         if(macro) {
    //             const macros = this.actor.getFlag(MODULE_ID, `macros.${this.label}`) || [];
    //             macros.push(macro.id);
    //             await this.actor.setFlag(MODULE_ID, `macros.${this.label}`, macros);
    //             await this.render();
    //         }
    //     } catch (error) { console.log(error); }
    // }
}

