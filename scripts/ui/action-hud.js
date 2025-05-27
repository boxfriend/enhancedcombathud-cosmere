import { BASIC_ACTIONS, MODULE_ID } from '../utilities.js';

const BUTTONS = CONFIG.ARGON.MAIN.BUTTONS;

class CosmereItemButton extends BUTTONS.ItemButton {

    async _onLeftClick(event) {
        this.actor.useItem(this.item);
    }

    get hasTooltip() { return true; }

    async getTooltipData() {
        const description = this.item.system.description;
        return {
            title: this.item.name,
            subtitle: game.i18n.localize(`COSMERE.Item.Type.${this.item.type.capitalize()}.label`),
            description: description.chat || description.short || description.value,
        }
    }
}

export default class CosmereActionHUD extends CONFIG.ARGON.MAIN.ActionPanel {
    get actionCost() { return 1; }
    get actionType() { return 'act'; }

    get label() {
        switch(this.actionType) {
            case 'act':
                return "▶".repeat(this.actionCost);
            case 'fre':
                return "▷";
            case 'rea':
                return "↩";
            default:
                return "UNKNOWN";
        }
    }

    #getActionsFilter(item) {
        const system = item.system;
        return system.activation?.cost?.type === this.actionType
            && item.type !== 'weapon' && item.name !== 'Strike'
            && (this.actionType !== 'act' || (this.actionType === 'act'
                && system.activation?.cost?.value === this.actionCost));
    }

    async _getButtons() {
        let actions = this.actor.items?.filter(this.#getActionsFilter.bind(this));

        const includeBasic = game.settings.get(MODULE_ID, "includeBasicActions");
        if(includeBasic)
            actions = BASIC_ACTIONS.filter(this.#getActionsFilter.bind(this)).concat(actions);

        if(actions && actions.length === 1)
            return [new CosmereItemButton({
                item: actions[0],
                inActionPanel: true,
            })];

        actions = this.#filterDuplicates(actions);
        if(actions && actions.length % 2 !== 0)
            actions.push(null);

        const buttons = [];

        actions.forEach(item => {
            if(item)
                buttons.push(new CosmereItemButton({
                    item: item,
                    inActionPanel: true,
                }));
            else
                buttons.push(new BUTTONS.ActionButton());
        });

        const splitButtons = [];
        for(let i = 0; i < buttons.length; i += 2) {
            const first = buttons[i];
            const second = buttons[i + 1];
            splitButtons.push(new BUTTONS.SplitButton(first, second));
        }

        return splitButtons;
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
}

