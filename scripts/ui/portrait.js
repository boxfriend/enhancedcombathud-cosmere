const ARGON = CONFIG.ARGON;

export default class CosmerePortrait extends ARGON.PORTRAIT.PortraitPanel {

    get description() {
        return Object.values(this.actor.paths).map(path => path.name).join(", ");
    }

    async getStatBlocks() {
        const system = this.actor.system;
        return [
            [
                { text: "HP:" },
                { text: system.resources.hea.value },
                { text: "/" },
                { text: system.resources.hea.max.value }
            ],
            [
                { text: "Foc:" },
                { text: system.resources.foc.value },
                { text: "/" },
                { text: system.resources.foc.max.value }
            ],
            [
                { text: "Inv:" },
                { text: system.resources.inv.value },
                { text: "/" },
                { text: system.resources.inv.max.value }
            ]
        ];

    }
    async _getButtons() {
        const buttons = [];

        if(game.combat){
            buttons.push({
                id: "toggle-speed",
                icon: "fas fa-stopwatch",
                label: "Toggle Turn Speed",
                onClick: (e) => {
                    const combatant = game.combat.getCombatantsByActor(this.actor)[0];
                    combatant?.toggleTurnSpeed();
                },
            });
        }

        buttons.push({
            id: "open-sheet",
            icon: "fas fa-suitcase",
            label: "Open Character Sheet",
            onClick: (e) => this.actor.sheet.render(true),
        },
        {
            id: "toggle-minimize",
            icon: "fas fa-caret-down",
            label: "Minimize",
            onClick: (e) => ui.ARGON.toggleMinimize(),
        });

        return buttons;
    }
}