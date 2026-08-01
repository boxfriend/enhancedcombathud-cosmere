# [Argon - Combat HUD (COSMERE-RPG)](https://foundryvtt.com/packages/enhancedcombathud-cosmere-rpg)

This module is for use with the [Argon - Combat HUD (CORE)](https://foundryvtt.com/packages/enhancedcombathud/) module along with the [Cosmere RPG System](https://foundryvtt.com/packages/cosmere-rpg) for the Foundry VTT.

![Example showcasing the layout of the HUD](/imgs/example.png "Example of the HUD layout")

#### Need help?
The quickest way to get help with the module is join the [Argon - Combat HUD (COSMERE-RPG)](https://discord.com/channels/1299110557689053264/1374520624403316807) thread in the Metalworks discord server. Otherwise, check the [FAQ](#faq) below and the Issues tab.

### Compatability
- ![Foundry v13](https://img.shields.io/badge/Foundry_VTT-v13-green?style=flat-square)
- ![Argon - Combat HUD(CORE)](https://img.shields.io/badge/enhancedcombathud%E2%80%93core-v4.1.2-green?style=flat-square)
- ![Cosmere RPG](https://img.shields.io/badge/cosmere%E2%80%93rpg-v3.0.1-green?style=flat-square)

### Features
- Weapon sets allow you to manage equipping different sets of weapons as well as provides clickable actions to roll the dice for those weapons in a convenient "Strike" action panel
- All non-strike actions that are on the character sheet will be sorted into the respective categories
- While in combat token movement is tracked in increments of tiles moved
- Buttons to toggle an actor's combat turn speed as well as open character sheet are located directly above the portrait
- While combat is not in progress buttons to rest are located next to the actor portrait
- The list of known skills is in a dropdown menu above the portrait to easily roll a skill
- Enriched tooltips when hovering over an action!
- Optionally exclude compendiums and world actions from being included

### FAQ
- How do I add my weapon actions to the hud?
  - Make sure your weapons are equipped via the Weapon Sets above the character portrait in the hud
- I have hidden an action on the bar, how can I show it again?
  - There is a menu to Unhide Actions in the module's settings
- I see way too many actions that I shouldn't have access to in my hud, what should I do?
  - Previously all compendiums were selected as a source to pull actions from by default, if you have used the module before that setting is likely still applied. In the module's settings you'll want to change it so that only the compendiums that contain basic actions are selected. This is typically just `cosmere-rpg/Actions` or `cosmere-rpg-stormlight-handbook/Actions` 
- How do I add a macro to the new accordion panels?
  - You can drag the macro onto the button that opens the panel you would like to include it in. The macro will then show up in a "Macros" grouping within the accordion panel

### TODO
- Implement action cost tracking when using actions during combat
- Hud Themes for the different settings
- . . . and more?
