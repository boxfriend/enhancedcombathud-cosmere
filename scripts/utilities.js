export const COMPENDIUM_BASIC_ACTIONS = [];
export const WORLD_BASIC_ACTIONS = [];
export const MODULE_ID = "enhancedcombathud-cosmere-rpg";
export const ITEM_COMPENDIUMS = [];

export default function setupUtilities() {
    findCompendiums();
    findCompendiumActions();
    findWorldActions();
    //TODO: other setup here
}

export async function findCompendiumActions() {
    const packIDs = game.settings.get(MODULE_ID, "selectedCompendiums") || ITEM_COMPENDIUMS;
    for(const packID of packIDs) {
        const pack = game.packs.get(packID);
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

function findCompendiums() {
    const compendiums = game.packs.filter(x => x.metadata.type === "Item" && x._getVisibleTreeContents().find(y => y.type === 'action'));
    console.log("Found Item Compendiums", compendiums);
    for(const c of compendiums) {
        ITEM_COMPENDIUMS.push(c.metadata.id);
    }
}

