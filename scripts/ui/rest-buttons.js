export default class CosmereRestButtons extends CONFIG.ARGON.ButtonHud {
    get visible() {
        return !game.combat?.started;
    }

    async _getButtons() {
        return [
            {
                label: game.i18n.localize("COSMERE.Actor.Sheet.ShortRest"),
                onClick: () => this.actor.shortRest(),
                icon: "fas fa-chair",
            },
            {
                label: game.i18n.localize("COSMERE.Actor.Sheet.LongRest"),
                onClick: () => this.actor.longRest(),
                icon: "fas fa-bed",
            }
        ];
    }
}