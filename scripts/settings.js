import { MODULE_ID } from './utilities.js';
import UnhideActionsForm from './ui/unhide-actions-form.js';
import CompendiumSelectionForm from './ui/compendium-selection-form.js';

export default function registerSettings() {

    const reloadText = game.i18n.localize(`${MODULE_ID}.Settings.RequiresReload`);
    game.settings.register(MODULE_ID, "overrideClient", {
        name: game.i18n.localize(`${MODULE_ID}.Settings.OverrideClient.Name`),
        hint: game.i18n.localize(`${MODULE_ID}.Settings.OverrideClient.Hint`),
        config: true,
        scope: "world",
        default: false,
        type: Boolean,
        requiresReload: true
    });

    const override = game.settings.get(MODULE_ID, "overrideClient");
    game.settings.register(MODULE_ID, "includeBasicActions", {
        name: game.i18n.localize(`${MODULE_ID}.Settings.CompendiumActions.Name`),
        hint: game.i18n.localize(`${MODULE_ID}.Settings.CompendiumActions.Hint`),
        scope: override ? "world" : "client",
        config: true,
        default: true,
        type: Boolean,
        onChange: () => ui.ARGON.refresh(),
    });

    game.settings.register(MODULE_ID, "includeWorldBasicActions", {
        name: game.i18n.localize(`${MODULE_ID}.Settings.WorldActions.Name`),
        hint: game.i18n.localize(`${MODULE_ID}.Settings.WorldActions.Hint`),
        scope: override ? "world" : "client",
        config: true,
        default: true,
        type: Boolean,
        onChange: () => ui.ARGON.refresh(),
    });

    game.settings.register(MODULE_ID, "includeSpePanel", {
        name: game.i18n.localize(`${MODULE_ID}.Settings.IncludeSpecial.Name`),
        hint: game.i18n.localize(`${MODULE_ID}.Settings.IncludeSpecial.Hint`),
        scope: override ? "world" : "client",
        config: true,
        default: true,
        type: Boolean,
        requiresReload: true,
    });

    game.settings.register(MODULE_ID, "includePassTurn", {
        name: game.i18n.localize(`${MODULE_ID}.Settings.IncludePassTurn.Name`),
        hint: game.i18n.localize(`${MODULE_ID}.Settings.IncludePassTurn.Hint`),
        scope: override ? "world" : "client",
        config: true,
        default: true,
        type: Boolean,
        requiresReload: true,
        restricted: override
    });

    game.settings.registerMenu(MODULE_ID, "unhideActions", {
        name: game.i18n.localize(`${MODULE_ID}.Settings.UnhideActions.Name`),
        label: game.i18n.localize(`${MODULE_ID}.Settings.UnhideActions.Label`),
        icon: "fa-solid fa-bars",
        type: UnhideActionsForm,
        restricted: false,
    });

    game.settings.registerMenu(MODULE_ID, "selectCompendiums", {
        name: game.i18n.localize(`${MODULE_ID}.Settings.SelectCompendiums.Name`),
        label: game.i18n.localize(`${MODULE_ID}.Settings.SelectCompendiums.Label`),
        icon: "fa-solid fa-bars",
        type: CompendiumSelectionForm,
        restricted: override,
    });

    game.settings.register(MODULE_ID, "selectedCompendiums", {
        config: false,
        scope: override ? "world" : "client",
    });

    game.settings.register(MODULE_ID, "showEmptyPanel", {
        name: game.i18n.localize(`${MODULE_ID}.Settings.ShowEmpty.Name`),
        hint: game.i18n.localize(`${MODULE_ID}.Settings.ShowEmpty.Hint`),
        scope: override ? "world" : "client",
        config: true,
        default: false,
        type: Boolean,
        onChange: () => ui.ARGON.refresh(),
    });
}
