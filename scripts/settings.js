import { MODULE_ID } from './utilities.js';

export default function registerSettings() {
    game.settings.register(MODULE_ID, "includeBasicActions", {
        name: "Include Compendium Actions",
        hint: "Optionally include basic actions from the compendium in the action hud",
        scope: "client",
        config: true,
        default: true,
        type: Boolean,
        onChange: () => ui.ARGON.refresh(),
    });

    game.settings.register(MODULE_ID, "includeWorldBasicActions", {
        name: "Include World Actions",
        hint: "Optionally include basic actions that have been imported into the world in the action hud",
        scope: "client",
        config: true,
        default: true,
        type: Boolean,
        onChange: () => ui.ARGON.refresh(),
    });
}