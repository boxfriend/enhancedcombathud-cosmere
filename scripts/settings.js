import { MODULE_ID } from './utilities.js';
import UnhideActionsForm from './ui/unhide-actions-form.js';
import CompendiumSelectionForm from './ui/compendium-selection-form.js';

export default function registerSettings() {
    game.settings.register(MODULE_ID, "includeBasicActions", {
        name: "Include Compendium Actions",
        hint: "Include basic actions from the compendium in the action hud",
        scope: "client",
        config: true,
        default: true,
        type: Boolean,
        onChange: () => ui.ARGON.refresh(),
    });

    game.settings.register(MODULE_ID, "includeWorldBasicActions", {
        name: "Include World Actions",
        hint: "Include basic actions that have been imported into the world in the action hud",
        scope: "client",
        config: true,
        default: true,
        type: Boolean,
        onChange: () => ui.ARGON.refresh(),
    });

    game.settings.register(MODULE_ID, "includePassTurn", {
        name: "Include Pass Turn Panel",
        hint: "Include a panel that allows the player to pass their turn during combat. REQUIRES REFRESH",
        scope: "client",
        config: true,
        default: true,
        type: Boolean,
        requiresReload: true,
    });

    game.settings.registerMenu(MODULE_ID, "unhideActions", {
        name: "Remove Hidden Actions",
        label: "Unhide Actions",
        icon: "fa-solid fa-bars",
        type: UnhideActionsForm,
        restricted: false,
    });

    game.settings.registerMenu(MODULE_ID, "selectCompendiums", {
        name: "Select Included Compendiums",
        label: "Select Compendiums",
        icon: "fa-solid fa-bars",
        type: CompendiumSelectionForm,
        restricted: false,
    });

    game.settings.register(MODULE_ID, "selectedCompendiums", {
        config: false,
        scope: "client",
    });
}