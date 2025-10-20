export default class CosmereWeaponSets extends CONFIG.ARGON.WeaponSets {
    async _onSetChange({sets, active}) {
        const now = Date.now();

        for(const id in sets) {
            const set = sets[id];
            const isActive = id === active;
            const primary = set["primary"]?.system;
            const secondary = set["secondary"]?.system;

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

            for(const hand in set)
            {
                const weapon = set[hand];
                const weaponSystem = weapon?.system;
                if (weaponSystem) {
                    weaponSystem.equipped = isActive;
                    weaponSystem.equip.hand = hand === 'primary' ? 'main_hand' : 'off_hand';
                    const update = {
                        system: {
                            equipped: isActive,
                            equip: { hand: weaponSystem.equip.hand }
                        },
                        _stats: { modifiedTime: now }
                    }
                    await weapon.update(update);
                }
            }
        }
    }
}
