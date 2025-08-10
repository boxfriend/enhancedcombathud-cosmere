import { COMPENDIUM_BASIC_ACTIONS, WORLD_BASIC_ACTIONS, MODULE_ID } from '../utilities.js';

const BUTTONS = CONFIG.ARGON.MAIN.BUTTONS;

class CosmereItemButton extends BUTTONS.ItemButton {

    async _onLeftClick(event) {
        this.actor.useItem(this.item);
    }

    get hasTooltip() { return true; }

    async getTooltipData() {
        const description = this.item.system.description;
        let descriptionData = description.chat || description.short || description.value;
        descriptionData = await TextEditor.enrichHTML(descriptionData, { relativeTo: this.actor });
        return {
            title: this.item.name,
            subtitle: game.i18n.localize(`COSMERE.Item.Type.${this.item.type.capitalize()}.label`),
            description: descriptionData,
        }
    }

    async _onRightClick(event) {
        const item = this.item.id;
        const hidden = this.actor.getFlag(MODULE_ID, "hiddenItems") || [];
        if(!hidden.includes(item)) {
            hidden.push(item);
            await this.actor.setFlag(MODULE_ID, "hiddenItems", hidden);
        }
        await this.parent.parent.render();
    }
}
class RemovableMacroButton extends BUTTONS.MacroButton {
    constructor({ macro, parent, inActionPanel=undefined}) {
        super({macro, inActionPanel});
        this.parentLabel = parent;
    }

    async _onRightClick(event) {
        const macro = game.macros.get(this.macro.id);
        if(macro) {
            const macros = this.actor.getFlag(MODULE_ID, `macros.${this.parentLabel}`) || [];
            macros.splice(macros.indexOf(macro.id), 1);
            await this.actor.setFlag(MODULE_ID, `macros.${this.parentLabel}`, macros);
            await this.parent.parent.render();
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
        return !this.#isHidden(item) && system.activation?.cost?.type === this.actionType
            && item.type !== 'weapon' && item.name !== 'Strike'
            && (this.actionType !== 'act' || (this.actionType === 'act'
                && system.activation?.cost?.value === this.actionCost));
    }

    #isHidden(item) {
        const hidden = this.actor.getFlag(MODULE_ID, "hiddenItems") || [];
        return hidden.includes(item.id);
    }

    async _getButtons() {
        let actions = this.actor.items?.filter(this.#getActionsFilter.bind(this));

        const includeBasic = game.settings.get(MODULE_ID, "includeBasicActions");
        if(includeBasic)
            actions = Array.from(COMPENDIUM_BASIC_ACTIONS).filter(this.#getActionsFilter.bind(this)).concat(actions);

        const includeWorld = game.settings.get(MODULE_ID, "includeWorldBasicActions");
        if(includeWorld)
            actions = Array.from(WORLD_BASIC_ACTIONS).filter(this.#getActionsFilter.bind(this)).concat(actions);
        actions = this.#filterDuplicates(actions);
        const macros = this.actor.getFlag(MODULE_ID, `macros.${this.label}`) || [];
        actions.push(...macros.map(id => game.macros.get(id)));

        if(actions && actions.length === 1)
            return [new CosmereItemButton({
                item: actions[0],
                inActionPanel: true,
            })];

        if(actions && actions.length % 2 !== 0)
            actions.push(null);

        const buttons = [];

        actions.forEach(item => {
            if(item) {
                if (item.type === 'action') {
                    buttons.push(new CosmereItemButton({
                        item: item,
                        inActionPanel: true,
                    }));
                } else {
                    buttons.push(new RemovableMacroButton({
                        macro: item,
                        inActionPanel: true,
                        parent: this.label,
                    }));
                }
            } else {
                buttons.push(new BUTTONS.ActionButton());
            }
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
    async activateListeners(html) {
        super.activateListeners(html);
        this.element.addEventListener("drop", this._onDrop.bind(this));

    }

    async _onDrop(event) {
        console.log("drop", event);
        try {
            event.preventDefault();
            event.stopPropagation();
            const data = JSON.parse(event.dataTransfer.getData("text/plain"));
            if (data?.type !== "Macro") return;
            const macro = game.macros.get(data.uuid.replace("Macro.", ""));
            if(macro) {
                const macros = this.actor.getFlag(MODULE_ID, `macros.${this.label}`) || [];
                macros.push(macro.id);
                await this.actor.setFlag(MODULE_ID, `macros.${this.label}`, macros);
                await this.render();
            }
        } catch (error) { console.log(error); }
    }
}

