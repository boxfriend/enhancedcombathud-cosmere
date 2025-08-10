const ARGON = CONFIG.ARGON;

export default class CosmereSkillsDrawer extends ARGON.DRAWER.DrawerPanel {
    constructor(...args) {
        super(...args);
    }

    get title() { return `${game.i18n.localize("COSMERE.Actor.Attribute.name_plural")} / ${game.i18n.localize("COSMERE.Actor.Skill.label_p")}`; }

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

        const attributes = CONFIG.COSMERE.attributes;
        const actorAttributes = this.actor.system.attributes;
        const attrButtons = [];
        for(const attr in attributes) {
            attrButtons.push(new ARGON.DRAWER.DrawerButton([{
                label: game.i18n.localize(attributes[attr].label),
                onClick: () => {
                    this.actor.rollSkill(skill);
                }
            }]));
        }

        return [{
            captions: [
                {
                    label: game.i18n.localize("COSMERE.Actor.Skill.label_p"),
                    align: "left",
                }
            ],
            buttons: skillButtons,
        },
        {
            captions: [
                {
                    label: game.i18n.localize("COSMERE.Actor.Attribute.name_plural"),
                    align: "left",
                }
            ],
            buttons: attrButtons,
        }];
    }
}
