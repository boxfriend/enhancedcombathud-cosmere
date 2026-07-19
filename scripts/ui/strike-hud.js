import { COMPENDIUM_BASIC_ACTIONS, MODULE_ID } from '../utilities.js';
import { CosmereWeaponButton, CosmereItemButton } from './action-buttons.js';

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

        let unarmed = this.actor.actions.find(
            (item) => item.system.id === 'unarmed-strike'
                || item.system.id === 'unamred-attack'
        );


        if(unarmed.type === 'weapon') {
            buttons.push(new CosmereWeaponButton({
                item: unarmed,
                actionCost: 1,
                inActionPanel: true,
            }));
        } else {
            buttons.push(new CosmereItemButton({
                item: unarmed,
                actionCost: 1,
                inActionPanel: true,
            }));
        }

        return buttons;
    }

}

