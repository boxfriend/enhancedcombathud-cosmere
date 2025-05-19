const ARGON = CONFIG.ARGON;

const SKILLS = {
    "abr": "Abrasion",
    "adh": "Adhesion",
    "agi": "Agility",
    "ath": "Athletics",
    "chs": "Cohesion",
    "cra": "Crafting",
    "dec": "Deception",
    "ded": "Deduction",
    "dis": "Discipline",
    "dvs": "Division",
    "grv": "Gravitation",
    "hwp": "Heavy Weapons",
    "ill": "Illumination",
    "inm": "Intimidation",
    "ins": "Insight",
    "lea": "Leadership",
    "lor": "Lore",
    "lwp": "Light Weapons",
    "med": "Medicine",
    "prc": "Perception",
    "prg": "Progression",
    "prs": "Persuasion",
    "stl": "Stealth",
    "sur": "Survival",
    "thv": "Thievery",
    "trp": "Transportation",
    "trs": "Transformation",
    "tsn": "Tension"
};
export default class CosmereSkillsDrawer extends ARGON.DRAWER.DrawerPanel {
    constructor(...args) {
        super(...args);
    }

    get title() { return "Skills"; }

    get categories() {

        const skillButtons = [];
        const skills = this.actor.system.skills;
        for (const skill in skills) {
            if (skills[skill].unlocked === false) { continue; }

            skillButtons.push(new ARGON.DRAWER.DrawerButton([{
                label: SKILLS[skill],
                onClick: () => {
                    this.actor.rollSkill(skill);
                }
            }]));
        }
        console.log(skillButtons);
        console.log(skills);
        return [{
            captions: [
                {
                    label: "Skills",
                    align: "center",
                }
            ],
            align: ["left"],
            buttons: skillButtons,
        }];
    }
}