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
}