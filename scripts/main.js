import CosmerePortrait from "./ui/portrait.js";
import CosmereSkillsDrawer from "./ui/drawer.js";
import CosmereWeaponSets from "./ui/weapon-sets.js"
import CosmereMovementHUD from "./ui/movement-hud.js";
import CosmereRestButtons from "./ui/rest-buttons.js";
import CosmereActionHUD from "./ui/action-hud.js";

Hooks.once("argonInit", (CoreHUD) => {
    console.log("Loading Cosmere Combat HUD");
    CoreHUD.definePortraitPanel(CosmerePortrait);
    CoreHUD.defineDrawerPanel(CosmereSkillsDrawer);
    CoreHUD.defineMainPanels([CosmereActionHUD, CoreHUD.ARGON.PREFAB.PassTurnPanel]);

    CoreHUD.defineWeaponSets(CosmereWeaponSets);
    CoreHUD.defineMovementHud(CosmereMovementHUD);
    CoreHUD.defineButtonHud(CosmereRestButtons);
    CoreHUD.defineSupportedActorTypes(["character", "adversary"]);
});