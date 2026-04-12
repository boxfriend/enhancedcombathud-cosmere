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

        const combatant = game.combat?.getCombatantByActor(this.actor);
        if(combatant)
        {
            ensureHasFlag(combatant);
            const actions = combatant.getFlag(MODULE_ID, "actions");
            combatant.setFlag(MODULE_ID,"actions", actions + this.actionCost);
            console.warn('boxfriend', actions, this.actionCost);
        }
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

    get label() {
        let name = this.item.name;
        if (this.item.system.equip.hand === 'off_hand') {
            name += " " + game.i18n.localize("COSMERE.Item.Equip.Hand.Off.Label");
        }
        return name;
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
