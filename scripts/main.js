console.log('hello world');
import CosmerePortrait from "./ui/portrait.js";
import CosmereWeaponSets from "./ui/weapon-sets.js"
Hooks.once("argonInit", (CoreHUD) => {
    console.log("Loading Cosmere Combat HUD");
    CoreHUD.definePortraitPanel(CosmerePortrait);
    CoreHUD.defineMainPanels([CoreHUD.ARGON.PREFAB.PassTurnPanel]);

    CoreHUD.defineWeaponSets(CosmereWeaponSets);
    CoreHUD.defineSupportedActorTypes(["character", "adversary"]);
});