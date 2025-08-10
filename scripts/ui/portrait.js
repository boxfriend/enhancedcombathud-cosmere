const ARGON = CONFIG.ARGON;

export default class CosmerePortrait extends ARGON.PORTRAIT.PortraitPanel {

    get description() {
        return Object.values(this.actor.paths).map(path => path.name).join(", ");
    }

    async getStatBlocks() {
        const system = this.actor.system;
        const stats = [
            [
                { text: "HP:" },
                {
					text: `${system.resources.hea.value} / ${system.resources.hea.max.value}`,
					color: "#286f3e"
				},
            ],
            [
                { text: "Foc:" },
                {
					text: `${system.resources.foc.value} / ${system.resources.foc.max.value}`,
					color: "#6e45e4"
				},
            ],
        ];

		if(system.resources.inv.max.value > 0) {
			stats.push([
                { text: "Inv:" },
                {
					text: `${system.resources.inv.value} / ${system.resources.inv.max.value}`,
					color: "#3e6abb"
				},
            ]);
		}
		
		return stats;

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