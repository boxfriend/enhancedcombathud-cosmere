export default class CosmereWeaponSets extends CONFIG.ARGON.WeaponSets {
    async _onSetChange({sets, active}) {
        console.log(sets, active);
    }
}