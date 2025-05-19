export default class CosmereWeaponSets extends CONFIG.ARGON.WeaponSets {
    async _onSetChange({sets, active}) {

        for(const id in sets) {
            const set = sets[id];

            const primary = set["primary"]?.system;
            primary && (primary.equipped = false);

            const secondary = set["secondary"]?.system;
            secondary && (secondary.equipped = false);

            const secondaryTwoHand = secondary && secondary.equip.hold === 'two_handed';
            const twoHand = secondaryTwoHand ||
                (secondary && primary && primary.equip.hold === 'two_handed');
            if(twoHand || (secondary && primary === secondary)) {
                await this._onContextMenu({
                    preventDefault: () => {},
                    stopPropagation: () => {},
                    currentTarget: {
                        dataset: {
                            set: id,
                            slot: 'secondary'
                        }
                    }
                });
                return;
            }
        }

        const activeSet = sets[active];

        const primary = activeSet["primary"]?.system;
        if(primary) {
            primary.equipped = true;
            primary.equip.hand = 'main_hand';
        }

        const secondary = activeSet["secondary"]?.system;
        if(secondary && secondary.equip.hold !== 'two_handed'){
            secondary.equipped = true;
            secondary.equip.hand = 'off_hand';
        }
    }
}