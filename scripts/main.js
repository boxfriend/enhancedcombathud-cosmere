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
        class extends CosmereActionHUD { get actionType() { return 'fre'; } },
        class extends CosmereActionHUD { get actionType() { return 'rea'; } },
    ];

    const includeSpeActions = game.settings.get(MODULE_ID, "includeSpePanel");
    if(includeSpeActions)
        mainPanels.push(class extends CosmereActionHUD { get actionType() { return 'spe'; } })

    const includePassTurn = game.settings.get(MODULE_ID, "includePassTurn");
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
        `<button id="${MODULE_ID}.refresh" title="${game.i18n.localize(`${MODULE_ID}.Settings.RefreshAll.Hint`)}" style="flex:1"><i class="fa-solid fa-arrows-rotate"></i><label>${game.i18n.localize(`${MODULE_ID}.Settings.RefreshAll.Name`)}</label></button>
         <p class="notes">${game.i18n.localize(`${MODULE_ID}.Settings.RefreshAll.Long`)}</p>                
    `);
    html.querySelector(`button[id="${MODULE_ID}.refresh"]`).addEventListener("click", (event) => { refreshAllActions().then(() => ui.ARGON.refresh()); });
});
