import { COMPENDIUM_BASIC_ACTIONS, MODULE_ID } from '../utilities.js';
import { CosmereWeaponButton } from './buttons/cosmere-weapon-button.js';
import { CosmereItemButton } from './buttons/cosmere-item-button.js';

export default class CosmereStrikeHUD extends CONFIG.ARGON.MAIN.ActionPanel {
    get label() {
        return game.i18n.localize("enhancedcombathud-cosmere-rpg.Actions.Types.Strikes");
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

        if(!unarmed) {
            const includeWorld = game.settings.get(MODULE_ID, "includeBasicActions");
            if(includeWorld)
                unarmed = COMPENDIUM_BASIC_ACTIONS.find(
                    (action) => action.system.id === 'unarmed-strike' 
                        || action.system.id === 'unarmed-attack'
                );
        }

        if(!unarmed) return buttons;

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

