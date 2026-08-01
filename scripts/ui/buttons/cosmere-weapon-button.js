import { CosmereItemButton } from "./cosmere-item-button.js";

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
