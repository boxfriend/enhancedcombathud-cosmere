export const COMPENDIUM_BASIC_ACTIONS = new Set();
export const WORLD_BASIC_ACTIONS = new Set();
export const MODULE_ID = "enhancedcombathud-cosmere-rpg";
export const ITEM_COMPENDIUMS = new Set();

export default function setupUtilities() {
    refreshAllActions();
    //TODO: other setup here
}

export async function refreshAllActions() {
    findCompendiums();
    findWorldActions();
    await findCompendiumActions();
}

export async function findCompendiumActions() {
    COMPENDIUM_BASIC_ACTIONS.clear();
    const packIDs = game.settings.get(MODULE_ID, "selectedCompendiums") || ITEM_COMPENDIUMS;
    for(const packID of packIDs) {
        const pack = game.packs.get(packID);
        if(!pack) continue;
        for(const document of pack._getVisibleTreeContents())
        {
            if(document.type === 'action') {
                const action = await pack.getDocument(document._id);
                if(action.system.type === 'basic')
                    COMPENDIUM_BASIC_ACTIONS.add(action);
            }
        }
    }
}

function findWorldActions() {
    WORLD_BASIC_ACTIONS.clear();
    const items = game.items.filter(x => x.type === 'action' && x.system.type === 'basic');
    items.forEach(item => WORLD_BASIC_ACTIONS.add(item));
}

export function findCompendiums() {
    ITEM_COMPENDIUMS.clear();
    const compendiums = game.packs.filter(x => x.metadata.type === "Item" && x._getVisibleTreeContents().find(y => y.type === 'action'));
    for(const c of compendiums) {
        ITEM_COMPENDIUMS.add(c.metadata.id);
    }
}

