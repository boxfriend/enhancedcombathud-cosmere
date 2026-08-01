import { MODULE_ID } from '../../utilities.js';

const BUTTONS = CONFIG.ARGON.MAIN.BUTTONS;

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

            // we need to make sure to target the panel button which is several layers higher
            let parent = this.parent;
            while(parent && !(parent instanceof CosmereButtonPanelButton))
                parent = parent.parent;

            if(parent){
                
                await parent._renderInner();
            }
                
        }
    }
}