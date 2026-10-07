import { MODULE_ID } from '../../utilities.js';
import { CosmereItemButton } from './cosmere-item-button.js';
import { RemovableMacroButton } from './removable-macro-button.js';

const BUTTONS = CONFIG.ARGON.MAIN.BUTTONS;
const ACCORDION = CONFIG.ARGON.MAIN.BUTTON_PANELS.ACCORDION;

export class CosmereButtonPanelButton extends BUTTONS.ButtonPanelButton {
    constructor(actions, cost, type) {
        super();
        this.actions = actions;
        this.cost = cost;
        this.actionType = type;
    }

    refreshIfValidAction(item) {
        const validAction = (item) => item.system.activation?.cost?.type === this.actionType
            && item.system.activation?.cost?.value === this.cost
            && !item.system.id.startsWith('strike-');
        if((item.type === 'action' && validAction(item)) || item.actions?.find(validAction)) {
            this._renderInner();
        }
    }

    async activateListeners(html) {
        super.activateListeners(html);
        this.element.addEventListener("drop", this._onDrop.bind(this));

    }

    async _onDrop(event) {

        try {
            event.preventDefault();
            event.stopPropagation();
            const data = JSON.parse(event.dataTransfer.getData("text/plain"));
            if (data?.type !== "Macro") return;
            const macro = game.macros.get(data.uuid.replace("Macro.", ""));
            if(macro) {
                const macros = this.actor.getFlag(MODULE_ID, `macros.${this.label}`) || [];

                if(macros.includes(macro.id)) return;

                macros.push(macro.id);
                await this.actor.setFlag(MODULE_ID, `macros.${this.label}`, macros);
                // push the macro into the array because we don't want to trigger the render for all panels
                // so the action isn't getting put into the array otherwise
                this.actions.push(macro);
                await this._renderInner();
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

    get icon() {
        switch(this.actionType) {
            case 'act':
                switch(this.cost) {
                    case 1:
                        return "modules/enhancedcombathud-cosmere-rpg/icons/one_action.svg"
                    case 2:
                        return "modules/enhancedcombathud-cosmere-rpg/icons/two_action.svg"
                    case 3:
                        return "modules/enhancedcombathud-cosmere-rpg/icons/three_action.svg"
                }
            case 'fre':
                return "modules/enhancedcombathud-cosmere-rpg/icons/free_action.svg";
            case 'rea':
                return "modules/enhancedcombathud-cosmere-rpg/icons/reaction.svg";
            case 'spe':
                return "modules/enhancedcombathud-cosmere-rpg/icons/special_action.svg";
            default:
                return "UNKNOWN";
        }
    }

    #validEquip(item) {
        const system = item.system;
        return system.alwaysEquipped
            // Not equippable at all
            || !system.equippableEnabled
            // Equippable and actually equipped
            || system.equipped;

    }

    async _getPanel() {
        const toButton = (item) => new CosmereItemButton({item, cost: this.cost})

        const notHidden = (item) => {
            const hidden = this.actor.getFlag(MODULE_ID, "hiddenItems") || [];
            return !hidden.includes(item.id);
        };

        const unhidden = this.actions.filter(notHidden);

        const basic_parents = ['character', 'adversary', 'trait'];
        const power_action_types = ['metallic-arts', 'stormlight'];

        const hasBasicOrNoParent = action => !action.parent || basic_parents.includes(action.parent.type);
        const isWeaponAction = action => action.parent?.type === 'weapon' && this.#validEquip(action.parent);
        const isAdversaryAction = action => hasBasicOrNoParent(action) && action.system?.type === 'adversary';
        const isTalentAction = action => action.parent?.type === 'talent';
        const isPowerAction = action => action.parent?.type === 'power' || power_action_types.includes(action.system?.type);
        const isBasicAction = action => hasBasicOrNoParent(action) && action.system?.type === 'basic';
        const isEquipmentAction = action => action.parent?.type === 'equipment' && this.#validEquip(action.parent);
        const isMacro = action => action.type === 'script' || action.type === 'chat';
        const allFilters = [ isWeaponAction, isAdversaryAction, isTalentAction, isPowerAction, isBasicAction, isEquipmentAction, isMacro ];

        const actions = [
            {
                label: game.i18n.localize('enhancedcombathud-cosmere-rpg.Actions.Groups.Weapons'),
                buttons: unhidden.filter(isWeaponAction)
                    .map(toButton)
            },
            {
                label: game.i18n.localize('enhancedcombathud-cosmere-rpg.Actions.Groups.Adversary'),
                buttons: unhidden.filter(isAdversaryAction)
                    .map(toButton)
            },
            {
                label: game.i18n.localize('enhancedcombathud-cosmere-rpg.Actions.Groups.Talents'),
                buttons: unhidden.filter(isTalentAction)
                    .map(toButton)
            },
            {
                label: game.i18n.localize('enhancedcombathud-cosmere-rpg.Actions.Groups.Powers'),
                buttons: unhidden.filter(isPowerAction)
                    .map(toButton)
            },
            {
                label: game.i18n.localize('enhancedcombathud-cosmere-rpg.Actions.Groups.Basic'),
                buttons: unhidden.filter(isBasicAction)
                    .map(toButton)
            },
            {
                label: game.i18n.localize('enhancedcombathud-cosmere-rpg.Actions.Groups.Equipment'),
                buttons: unhidden.filter(isEquipmentAction)
                    .map(toButton)
            },
            {
                label: game.i18n.localize('enhancedcombathud-cosmere-rpg.Actions.Groups.Macros'),
                buttons: unhidden.filter(isMacro)
                    .map((action) => new RemovableMacroButton({ macro: action, parent: this.label }))
            },
            {
                label: game.i18n.localize('enhancedcombathud-cosmere-rpg.Actions.Groups.Other'),
                buttons: unhidden.filter(action => !allFilters.some(filter => filter(action)))
                    .map(toButton)
            }
        ];

        return new ACCORDION.AccordionPanel({ id: this.label,
            accordionPanelCategories: actions.filter(x => x.buttons?.length > 0).map(({label, buttons}) =>
                new ACCORDION.AccordionPanelCategory({ label, buttons })
            )
        });
    }
}