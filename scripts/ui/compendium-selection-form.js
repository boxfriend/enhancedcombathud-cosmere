import { MODULE_ID, ITEM_COMPENDIUMS, findCompendiumActions } from "../utilities.js";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export default class CompendiumSelectionForm extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        ...super.DEFAULT_OPTIONS,
        tag: "form",
        form: {
            handler: this.handleForm,
            submitOnChange: false,
            closeOnSubmit: true,
        },
        window: {
            title: "Select Included Compendiums",
            contentClasses: ["standard-form"]
        }
    };

    static PARTS = {
        form: {
            template: `modules/${MODULE_ID}/templates/compendium-selection.hbs`,
        },
        footer: {
            template: "templates/generic/form-footer.hbs",
        }
    };

    async _prepareContext(options) {
        const compendiums = [];
        const saved = game.settings.get(MODULE_ID, "selectedCompendiums") || ITEM_COMPENDIUMS;
        console.log("rendering compendium selection...");
        for(const id of ITEM_COMPENDIUMS) {
            const compendium = game.packs.get(id);
            if(!compendium) continue;

            compendiums.push({
                name: compendium.metadata.label,
                id,
                checked: saved.includes(id)
            });
        }
        return {
            compendiums,
            buttons: [
                { type: "submit", icon: "fa-solid fa-save", label: "Save Selected" },
                { type: "button", icon: "fa-solid fa-arrows-rotate", label: "Refresh List" },
                { type: "cancel", icon: "fa-solid fa-cancel", label: "Cancel" },
            ]
        }
    }

    static async handleForm(event, form, data) {


    }
}