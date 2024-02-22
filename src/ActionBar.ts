import MeleeAttack from "./Character/Actions/MeleeAttack"
import RangeAttack from "./Character/Actions/RangeAttack"
import ElementNode, { Style } from "./Renderer/Drawables/SceneNodes/ElementNode"
import FlexBox from "./Renderer/Drawables/SceneNodes/FlexBox"
import TextBox from "./Renderer/Drawables/SceneNodes/TextBox"
import SceneGraph2D from "./Renderer/SceneGraph2d"
import { CreatureActorInterface } from "./types"

export const statusBar = (actor: CreatureActorInterface) => {
  const flex = new FlexBox()

  const actionStyle = {
    width: 32,
    height: 32,
    backgroundColor: [0, 0.5, 0, 1],
  }

  const bonusStyle = {
    ...actionStyle,
    backgroundColor: [1, 0.65, 0, 1],
  }

  const action = new ElementNode(actionStyle);
  const bonus  = new ElementNode(bonusStyle);

  flex.nodes.push(action, bonus)

  return flex;
}

const actionItems = (actor: CreatureActorInterface) => {
  const flex = new FlexBox({
    backgroundColor: [0.25, 0, 0, 1],
    border: { color: [1, 1, 1, 1], width: 1 },
    padding: { left: 4, right: 4 },
  })

  const actionStyle: Style = {
    width: 48,
    height: 48,
    backgroundColor: [0, 0.5, 0, 1],
    margin: { left: 4, top: 8, right: 4, bottom: 8 },
    border: { color: [1, 1, 1, 1], width: 1 },
  }

  const bonusStyle: Style = {
    ...actionStyle,
    color: [0, 0, 0, 1],
    backgroundColor: [1, 0.65, 0, 1],
  }

  if (actor.character.equipped.meleeWeapon) {
    const action = new ElementNode(actionStyle)
    action.nodes.push(new TextBox('Melee'));
    action.onClick = () => {
      actor.setAction(new MeleeAttack(actor));
    }

    flex.nodes.push(action)
  }

  if (actor.character.equipped.rangeWeapon) {
    const action = new ElementNode(actionStyle)
    action.nodes.push(new TextBox('Range'));
    action.onClick = () => {
      actor.setAction(new RangeAttack(actor));
    }

    flex.nodes.push(action)
  }

  for (const spell of actor.character.spells) {
    let style = actionStyle
    if (spell.time === 'Bonus') {
      style = bonusStyle
    }

    const action = new ElementNode(style)
    action.nodes.push(new TextBox(spell.name));

    flex.nodes.push(action)
  }

  for (const spell of actor.character.cantrips) {
    let style = actionStyle
    if (spell.time === 'Bonus') {
      style = bonusStyle
    }
    
    const green = new ElementNode(style)
    green.nodes.push(new TextBox(spell.name));

    flex.nodes.push(green)
  }

  for (const action of actor.character.charClass.actions) {
    let style = actionStyle
    if (action.time === 'Bonus') {
      style = bonusStyle
    }
    
    const green = new ElementNode(style)
    green.nodes.push(new TextBox(action.name));

    flex.nodes.push(green)
  }
  
  return flex;
}

export const addActionBar = async (actor: CreatureActorInterface, scene2d: SceneGraph2D) => {
  const status = statusBar(actor)
  const actions = actionItems(actor)

  const flex = new FlexBox({ flexDirection: 'column' })

  flex.nodes.push(status, actions)
  
  scene2d.scene2d = new ElementNode()
  scene2d.addNode(flex)
}
