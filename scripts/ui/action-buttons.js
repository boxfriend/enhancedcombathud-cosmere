import { MODULE_ID } from '../utilities.js';

const BUTTONS = CONFIG.ARGON.MAIN.BUTTONS;

export class CosmereItemButton extends BUTTONS.ItemButton {
    constructor({item, actionCost, isWeaponSet=false, isPrimary=false,
                    inActionPanel=undefined}) {
        super({item, isWeaponSet, isPrimary, inActionPanel});
        this.actionCost = actionCost;
    }
    async _onLeftClick(event) {
        this.actor.useItem(this.item);
    }

    get hasTooltip() { return true; }

    async getTooltipData() {
        const description = this.item.system.description;
        let descriptionData = description.chat || description.short || description.value;
        descriptionData = await foundry.applications.ux.TextEditor.implementation.enrichHTML(descriptionData, { relativeTo: this.actor });
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
        await this.parent.parent.parent.render();
    }

    get template() { return new BUTTONS.ItemButton({item: null}).template; }
}

export class RemovableMacroButton extends BUTTONS.MacroButton {
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

export class CosmereWeaponButton extends CosmereItemButton {

    async _onLeftClick() {
        this.actor.useItem(this.strike);
    }

    get label() {
        let name = this.strike.name;
        if (this.item.system.equip.hand === 'off_hand') {
            name += " " + game.i18n.localize("COSMERE.Item.Equip.Hand.Off.Label");
        }
        return name;
    }

    get strike() {
        return this.item.actions.find(
            (action) => action.system.id.startsWith('strike-')
        );
    }

    async getTooltipData() {
        const system = this.item.system.attack;
        const type = system.type.capitalize();
        let subtitle = game.i18n.localize(`COSMERE.Attack.Type.${type}`);

        if (type === 'Ranged') {
            const range = system.range;
            subtitle += ` (${range.value}${range.unit} / ${range.long}${range.unit})`;
        }

        const description = this.item.system.description;
        return {
            title: this.item.name,
            subtitle: subtitle,
            description: description.chat || description.short || description.value,
        }
    }

    async _onRightClick(event) {    }
}

export class CosmereButtonPanelButton extends BUTTONS.ButtonPanelButton {
    constructor(actions, cost, type) {
        super();
        this.actions = actions;
        this.cost = cost;
        this.actionType = type;

        Hooks.on('boxfriend-SetChangesComplete', () => this._renderInner());
        Hooks.on('updateItem', (item) => {
            const validAction = (item) => item.system.activation?.cost?.type === this.actionType 
                && item.system.activation?.cost?.value === this.cost
                && !item.system.id.startsWith('strike-');
            if((item.type === 'action' && validAction(item)) || item.actions?.find(validAction)) {
                this._renderInner();
            }
        });
    }

    async activateListeners(html) {
        super.activateListeners(html);
        this.element.addEventListener("drop", this._onDrop.bind(this));

    }

    async _onDrop(event) {
        console.log("drop", event, this);
        try {
            event.preventDefault();
            event.stopPropagation();
            const data = JSON.parse(event.dataTransfer.getData("text/plain"));
            console.log(data, event.dataTransfer.getData("text/plain"))
            if (data?.type !== "Macro") return;
            const macro = game.macros.get(data.uuid.replace("Macro.", ""));
            console.log(macro);
            if(macro) {
                const macros = this.actor.getFlag(MODULE_ID, `macros.${this.label}`) || [];
                macros.push(macro.id);
                console.log(macros);
                await this.actor.setFlag(MODULE_ID, `macros.${this.label}`, macros);
                await this.panel.render();
            }
        } catch (error) { console.log(error); }
    }

    get label() {
        switch(this.actionType) {
            case 'act':
                return "▶".repeat(this.cost);
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
    
    async _getPanel() {
        const cost = this.cost;
        return new CONFIG.ARGON.MAIN.BUTTON_PANELS.ButtonPanel({ id: this.label, buttons: this.actions.map((item) => {
            if(item.type === "script" || item.type === "chat") {
                return new RemovableMacroButton({
                        macro: item,
                        inActionPanel: true,
                        parent: this.label,
                    });
            } else {
                return new CosmereItemButton({ item, cost }) 
            }
        })});
    }
}

export class CosmereButtonPanel extends CONFIG.ARGON.MAIN.BUTTON_PANELS.ButtonPanel {

    get template() { return new CONFIG.ARGON.MAIN.BUTTON_PANELS.ButtonPanel().template; }
    
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
                const macros = this.actor.getFlag(MODULE_ID, `macros.${this.id}`) || [];
                macros.push(macro.id);
                await this.actor.setFlag(MODULE_ID, `macros.${this.id}`, macros);
                await this.render();
            }
        } catch (error) { console.log(error); }
    }
}