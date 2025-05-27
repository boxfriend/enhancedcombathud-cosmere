import data from '../module.json' assert { type: 'json' };

export const BASIC_ACTIONS = [];
export const MODULE_ID = data.id;

export default async function setupUtilities() {
    findBasicActions();
    //TODO: other setup here
}

export async function findBasicActions() {
    for(const pack of game.packs.filter(x => x.metadata.type === "Item")) {
        for(const document of pack._getVisibleTreeContents())
        {
            if(document.type === 'action') {
                const action = await pack.getDocument(document._id);
                if(action.system.type === 'basic')
                    BASIC_ACTIONS.push(action);
            }
        }
    }
}

