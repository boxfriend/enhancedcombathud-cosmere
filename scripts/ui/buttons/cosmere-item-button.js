import { MODULE_ID } from '../../utilities.js';

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


