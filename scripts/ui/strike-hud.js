import { CosmereWeaponButton } from './ActionButtons.js';

export default class CosmereStrikeHUD extends CONFIG.ARGON.MAIN.ActionPanel {
    get label() {
        return game.i18n.localize("COSMERE.Item.Weapon.Strike");
    }

    async _getButtons() {
        const buttons = [
            new CosmereWeaponButton({
                isWeaponSet: true,
                inActionPanel: true,
                isPrimary: true,
                actionCost: 1,
            }),
            new CosmereWeaponButton({
                isWeaponSet: true,
                inActionPanel: true,
                isPrimary: false,
                actionCost: 1,
            })
        ];

        const unarmed = this.actor.items.find((item) => item.name === 'Unarmed Strike');
        buttons.push(new CosmereWeaponButton({
            item: unarmed,
            actionCost: 1,
            inActionPanel: true,
        }));

        return buttons;
    }

}

