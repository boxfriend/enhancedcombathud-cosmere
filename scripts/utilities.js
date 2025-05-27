export const BASIC_ACTIONS = [];

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
