import CosmerePortrait from "./ui/portrait.js";
import CosmereSkillsDrawer from "./ui/drawer.js";
import CosmereWeaponSets from "./ui/weapon-sets.js"
import CosmereMovementHUD from "./ui/movement-hud.js";
import CosmereRestButtons from "./ui/rest-buttons.js";
import CosmereStrikeHUD from "./ui/strike-hud.js";
import CosmereActionHUD from "./ui/action-hud.js";
import setupUtilities from "./utilities.js";
import registerSettings from "./settings.js";
import { MODULE_ID, refreshAllActions } from "./utilities.js";

Hooks.once("argonInit", (CoreHUD) => {
    console.log("Loading Cosmere Combat HUD");
    CoreHUD.definePortraitPanel(CosmerePortrait);
    CoreHUD.defineDrawerPanel(CosmereSkillsDrawer);

    const mainPanels = [
        CosmereStrikeHUD,
        CosmereActionHUD,
        class extends CosmereActionHUD { get actionCost() { return 2; } },
        class extends CosmereActionHUD { get actionCost() { return 3; } },
        class extends CosmereActionHUD { get actionType() { return 'fre'; } },
        class extends CosmereActionHUD { get actionType() { return 'rea'; } },
        ];

    const includePassTurn = game.settings.get(MODULE_ID, "includePassTurn"); //TODO: Make this a setting
    if(includePassTurn)
        mainPanels.push(CoreHUD.ARGON.PREFAB.PassTurnPanel);

    CoreHUD.defineMainPanels(mainPanels);
    CoreHUD.defineWeaponSets(CosmereWeaponSets);
    CoreHUD.defineMovementHud(CosmereMovementHUD);
    CoreHUD.defineButtonHud(CosmereRestButtons);
    CoreHUD.defineSupportedActorTypes(["character", "adversary"]);
});

//Gotta make sure settings are registered before the argon stuff is invoked
Hooks.once("init", registerSettings);
Hooks.once("ready", setupUtilities);

Hooks.on("renderSettingsConfig", (app, html, data) => {
    html = html instanceof jQuery ? html[0] : html;
    const thing = html.querySelector(`section[data-tab=${MODULE_ID}]`);
    thing.insertAdjacentHTML("beforeend",
        `<button id="${MODULE_ID}.refresh" title="Refreshes all cached actions and compendiums." style="flex:1"><i class="fa-solid fa-arrows-rotate"></i><label>Refresh All Actions</label></button>
         <p class="notes">Refreshes all cached compendiums and actions. Useful if you have added or removed actions or compendiums and want to refresh Argon.</p>                
    `);
    html.querySelector(`button[id="${MODULE_ID}.refresh"]`).addEventListener("click", (event) => { refreshAllActions(); ui.ARGON.refresh(); });
});

if(!String.prototype.hasOwnProperty('capitalize')) {
    Object.defineProperty(String.prototype, 'capitalize', {
        value: function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        },
        enumerable: false,
        writable: false,
    });
}

Handlebars.registerHelper('isChecked', (checked) => checked ? "checked" : "");