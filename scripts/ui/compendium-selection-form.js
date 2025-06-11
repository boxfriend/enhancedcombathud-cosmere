import { MODULE_ID, ITEM_COMPENDIUMS, findCompendiums, findCompendiumActions } from "../utilities.js";
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

        for(const id of ITEM_COMPENDIUMS) {
            const compendium = game.packs.get(id);
            if(!compendium) continue;

            const checked = Array.isArray(saved) ? saved.includes(id) : saved.has(id);
            compendiums.push({
                name: compendium.metadata.label,
                id,
                checked,
            });
        }
        return {
            compendiums,
            buttons: [
                { type: "submit", icon: "fa-solid fa-save", label: "Save Selected" },
                { type: "button", icon: "fa-solid fa-arrows-rotate", label: "Refresh List", name: `${MODULE_ID}.refresh` },
                { type: "cancel", icon: "fa-solid fa-cancel", label: "Cancel" },
            ]
        }
    }

    _onRender(context, options) {
        const thing = this.element.querySelector(`button[type="button"][name="${MODULE_ID}.refresh"]`)
            .addEventListener("click", (event) => { findCompendiums(); this.render(); });
    }

    static async handleForm(event, form, data) {
        const formData = data.values();
        const selected = [];
        for(const values of formData) {
            const ids = CompendiumSelectionForm.#parseValues(values).filter(x => x);
            selected.push(...ids);
        }

        game.settings.set(MODULE_ID, "selectedCompendiums", selected);
        await findCompendiumActions();
        ui.ARGON.refresh();
    }

    static #parseValues(data) {
        try {
            const arr = JSON.parse(data);
            return arr;
        } catch (e) {
            return [data];
        }
    }
}