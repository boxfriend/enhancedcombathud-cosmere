import { MODULE_ID } from "../utilities.js";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export default class UnhideActionsForm extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        tag: "form",
        form: {
            handler: this.handleForm,
            submitOnChange: false,
            closeOnSubmit: true,
        }
    };

    static PARTS = {
        form: {
          template: `modules/${MODULE_ID}/templates/form-template.hbs`,
        },
        footer: {
            template: "templates/generic/form-footer.hbs",
        }
    };

    async _prepareContext(options) {
        const actors = game.actors.filter(a => a.isOwner);
        const actorData = [];

        for(const actor of actors) {
            const hidden = actor.getFlag(MODULE_ID, "hiddenItems") || [];
            const items = [];
            for(const item of hidden) {
                const itemData = game.items.get(item);
                items.push({
                    id: item,
                    name: itemData.name
                });
            }
            if(items.length !== 0)
                actorData.push({
                    name: actor.name,
                    id: actor.id,
                    items,
                });
        }

        return {
            actorData,
            buttons: [
                { type: "submit", icon: "fa-solid fa-save", label: "Unhide Selected" },
            ]
        }
    }

    static async handleForm(event, form, data) {
        const actors = data.keys();
        for(const actor of actors) {
            const gameActor = game.actors.get(actor);
            const hidden = gameActor.getFlag(MODULE_ID, "hiddenItems") || [];
            const itemData = data.getAll(actor)[0];
            console.log("itemData", itemData);
            if(itemData.startsWith("[")) {
                const itemIDs = JSON.parse(itemData);
                for (const itemID of itemIDs) {
                    UnhideActionsForm.#remove(hidden, itemID);
                }
            } else {
                UnhideActionsForm.#remove(hidden, itemData);
            }
            await gameActor.setFlag(MODULE_ID, "hiddenItems", hidden);
            ui.ARGON.refresh();
        }
    }

    static #remove(array, value) {
        if(array.includes(value))
            array.splice(array.indexOf(value), 1);
    }

}