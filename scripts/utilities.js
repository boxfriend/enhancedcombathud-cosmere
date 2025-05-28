export const COMPENDIUM_BASIC_ACTIONS = [];
export const WORLD_BASIC_ACTIONS = [];
export const MODULE_ID = "enhancedcombathud-cosmere-rpg";

export default function setupUtilities() {
    findCompendiumActions();
    findWorldActions();
    //TODO: other setup here
}

async function findCompendiumActions() {
    for(const pack of game.packs.filter(x => x.metadata.type === "Item")) {
        for(const document of pack._getVisibleTreeContents())
        {
            if(document.type === 'action') {
                const action = await pack.getDocument(document._id);
                if(action.system.type === 'basic')
                    COMPENDIUM_BASIC_ACTIONS.push(action);
            }
        }
    }
}

function findWorldActions() {
    const items = game.items.filter(x => x.type === 'action' && x.system.type === 'basic');
    WORLD_BASIC_ACTIONS.push(...items);
}

