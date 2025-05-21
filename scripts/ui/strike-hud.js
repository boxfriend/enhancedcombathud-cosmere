class CosmereWeaponButton extends CONFIG.ARGON.MAIN.BUTTONS.ItemButton {

    get label() {
        let name = this.item.name;
        if (this.item.system.equip.hand === 'off_hand') {
            name += " " + game.i18n.localize("COSMERE.Item.Equip.Hand.Off.Label");
        }
        return name;
    }
    async _onLeftClick(event) {
        this.actor.useItem(this.item);
    }
}

export default class CosmereStrikeHUD extends CONFIG.ARGON.MAIN.ActionPanel {
    get label() {
        return game.i18n.localize("COSMERE.Item.Weapon.Strike");
    }

    async _getButtons() {
        const buttons = [
            new CosmereWeaponButton({
                isWeaponSet: true,
                inActionPanel: true,
                isPrimary: true,
            }),
            new CosmereWeaponButton({
                isWeaponSet: true,
                inActionPanel: true,
                isPrimary: false,
            })
        ];

        const unarmed = this.actor.items.find((item) => item.name === 'Unarmed Strike');
        buttons.push(new CosmereWeaponButton({
            item: unarmed,
            inActionPanel: true,
        }));

        console.log("buttons", buttons);
        return buttons;
    }

}

