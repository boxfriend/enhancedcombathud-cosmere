const ARGON = CONFIG.ARGON;

export default class CosmereSkillsDrawer extends ARGON.DRAWER.DrawerPanel {
    constructor(...args) {
        super(...args);
    }

    get title() { return game.i18n.localize("COSMERE.Actor.Skill.label_p"); }

    get categories() {
        const skills = CONFIG.COSMERE.skills;

        const skillButtons = [];
        const actorSkills = this.actor.system.skills;
        for (const skill in skills) {
            if (actorSkills[skill]?.unlocked === false) { continue; }

            skillButtons.push(new ARGON.DRAWER.DrawerButton([{
                label: game.i18n.localize(skills[skill].label),
                onClick: () => {
                    this.actor.rollSkill(skill);
                }
            }]));
        }

        return [{
            captions: [
                {
                    label: game.i18n.localize("COSMERE.Actor.Skill.label"),
                    align: "center",
                }
            ],
            align: ["left"],
            buttons: skillButtons,
        }];
    }
}