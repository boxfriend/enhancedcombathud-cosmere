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
        const actions = [
            {
                label: 'Weapon',
                buttons: unhidden.filter(action => action.parent?.type === 'weapon' && this.#validEquip(action.parent))
                    .map(toButton)
            },
            {
                label: 'Talents',
                buttons: unhidden.filter(action => action.parent?.type === 'talent')
                    .map(toButton)
            },
            {
                label: 'Powers',
                buttons: unhidden.filter(action => action.parent?.type === 'power')
                    .map(toButton)
            },
            {
                label: 'Basic',
                buttons: unhidden.filter(action => !action.parent && action.system?.type === 'basic')
                    .map(toButton)
            },
            {
                label: 'Equipment',
                buttons: unhidden.filter(action => action.parent?.type === 'equipment' && this.#validEquip(action.parent))
                    .map(toButton)
            },
            {
                label: 'Macros',
                buttons: unhidden.filter(action => !action.parent && (action.type === 'script' || action.type === 'chat'))
                    .map((action) => new RemovableMacroButton({ macro: action, parent: this.label }))
            }
        ];

        return new ACCORDION.AccordionPanel({ id: this.label, 
            accordionPanelCategories: actions.filter(x => x.buttons?.length > 0).map(({label, buttons}) =>
                new ACCORDION.AccordionPanelCategory({ label, buttons })
            )
        });
    }
}