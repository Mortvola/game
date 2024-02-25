import { IReactionDisposer, autorun } from "mobx"
import { meleeAttack } from "./Character/Actions/MeleeAttack"
import { rangeAttack } from "./Character/Actions/RangeAttack"
import ElementNode, { Style } from "./Renderer/Drawables/SceneNodes/ElementNode"
import FlexBox from "./Renderer/Drawables/SceneNodes/FlexBox"
import TextBox from "./Renderer/Drawables/SceneNodes/TextBox"
import SceneGraph2D from "./Renderer/SceneGraph2d"
import { CreatureActorInterface } from "./types"

const spellSlots = (actor: CreatureActorInterface) => {
  const levels = new FlexBox({ columnGap: 8 })

  for (let level = 0; level < actor.character.getMaxSpellLevel()!; level += 1) {
    const available = actor.character.spellSlots[level]

    const slots = new FlexBox()

    for (let i = 0; i < actor.character.getMaxSpellSlots(level + 1)!; i += 1) {
      slots.nodes.push(new ElementNode({
        width: 16,
        height: 32,
        margin: { left: 0.5, right: 0.5 },
        border: { color: [0.75, 0.75, 0, 1], width: 1 },
        backgroundColor: i < available ? [0.75, 0.75, 0, 1] : [0, 0, 0, 1],
      }))
    }

    levels.nodes.push(slots)
  }

  return levels;
}

const statusBar = (actor: CreatureActorInterface) => {
  const flex = new FlexBox({ columnGap: 8 })

  const actionStyle = {
    width: 32,
    height: 32,
    backgroundColor: actor.character.actionsLeft > 0 ? [0, 0.5, 0, 1] : [0, 0, 0, 1],
    border: { color: [1, 1, 1, 1], width: 1 },
  }

  const bonusStyle = {
    ...actionStyle,
    backgroundColor: actor.character.bonusActionsLeft > 0 ? [1, 0.65, 0, 1] : [0, 0, 0, 1],
  }

  const action = new ElementNode(actionStyle);
  const bonus  = new ElementNode(bonusStyle);

  flex.nodes.push(action, bonus, spellSlots(actor))

  return flex;
}

const actionItems = (actor: CreatureActorInterface) => {
  const wrapper = new FlexBox();

  const commonActions = new FlexBox({
    flexDirection: 'column',
    justifyContent: 'center',
    height: 2 * 54 + 1 * 4 + 8,
    margin: { top: 4 },
  })
  wrapper.nodes.push(commonActions)

  const actionTray = new FlexBox({
    backgroundColor: [0.25, 0, 0, 1],
    columnGap: 4,
    width: 6 * 54 + 5 * 4,
    height: 2 * 54 + 1 * 4,
    margin: { left: 4, right: 4, top: 4, bottom : 4 },
    border: { color: [1, 1, 1, 1], width: 1 },
    padding: { left: 4, right: 4, top: 4, bottom: 4 },
  })
  wrapper.nodes.push(actionTray)

  const actionColor = [0, 0.5, 0, 1];
  const bonusColor = [1, 0.65, 0, 1];
  const disabledBackgroundColor = [0.5, 0.5, 0.5, 1];
  const unselectdBorder = { color: [1, 1, 1, 1], width: 1 };
  const selectedBorder = { color: [1, 1, 0, 1], width: 3 };

  const actionStyle: Style = {
    width: 48,
    height: 48,
    backgroundColor: actionColor,
    border: { color: [1, 1, 1, 1], width: 1 },
    margin: { top: 2, left: 2, bottom: 2, right: 2 },
  }

  const bonusStyle: Style = {
    ...actionStyle,
    color: [0, 0, 0, 1],
    backgroundColor: bonusColor,
  }

  const currentAction = actor.getAction()

  {
    const action = new ElementNode({
      ...actionStyle,
      border: currentAction === meleeAttack ? selectedBorder : unselectdBorder,
      margin: currentAction === meleeAttack ? undefined : { top: 2, left: 2, bottom: 2, right: 2 },
      backgroundColor: actor.character.equipped.meleeWeapon && actor.character.actionsLeft > 0 ?  actionStyle.backgroundColor : disabledBackgroundColor,
    })
    action.nodes.push(new TextBox('Melee'));
    action.onClick = () => {
      if (actor.character.equipped.meleeWeapon) {
        actor.setAction(meleeAttack);
      }
    }

    commonActions.nodes.push(action)
  }

  {
    const action = new ElementNode({
      ...actionStyle,
      border: currentAction === rangeAttack ? selectedBorder : unselectdBorder,
      margin: currentAction === rangeAttack ? undefined : { top: 2, left: 2, bottom: 2, right: 2 },
      backgroundColor: actor.character.equipped.rangeWeapon && actor.character.actionsLeft > 0 ?  actionStyle.backgroundColor : disabledBackgroundColor,
    })
    action.nodes.push(new TextBox('Range'));
    action.onClick = () => {
      if (actor.character.equipped.rangeWeapon) {
        actor.setAction(rangeAttack);
      }
    }

    commonActions.nodes.push(action)
  }

  // Actions for spells
  for (const spell of actor.character.spells) {
    let style = actionStyle
    if (spell.time === 'Bonus') {
      style = bonusStyle
    }

    const action = new ElementNode({
      ...style,
      border: currentAction === spell ? selectedBorder : unselectdBorder,
      margin: currentAction === spell ? undefined : { top: 2, left: 2, bottom: 2, right: 2 },
      backgroundColor: spell.available(actor) ?  style.backgroundColor : disabledBackgroundColor,
    })
    
    action.nodes.push(new TextBox(spell.name));
    action.onClick = () => {
      if (spell.available(actor)) {
        actor.setAction(spell);
      }
    }

    actionTray.nodes.push(action)
  }

  // Actions for cantrips
  for (const spell of actor.character.cantrips) {
    let style = actionStyle
    if (spell.time === 'Bonus') {
      style = bonusStyle
    }
    
    const action = new ElementNode({
      ...style,
      border: currentAction === spell ? selectedBorder : unselectdBorder,
      margin: currentAction === spell ? undefined : { top: 2, left: 2, bottom: 2, right: 2 },
      backgroundColor: spell.available(actor) ?  style.backgroundColor : disabledBackgroundColor,
    })
    
    action.nodes.push(new TextBox(spell.name));
    action.onClick = () => {
      if (spell.available(actor)) {
        actor.setAction(spell);
      }
    }

    actionTray.nodes.push(action)
  }

  // Actions for class actions
  for (const classAction of actor.character.charClass.actions) {
    let style = actionStyle
    if (classAction.time === 'Bonus') {
      style = bonusStyle
    }
    
    const action = new ElementNode({
      ...style,
      border: currentAction === classAction ? selectedBorder : unselectdBorder,
      margin: currentAction === classAction ? undefined : { top: 2, left: 2, bottom: 2, right: 2 },
      backgroundColor: classAction.available(actor) ?  style.backgroundColor : disabledBackgroundColor,
    })
    
    action.nodes.push(new TextBox(action.name));
    action.onClick = () => {
      if (classAction.available(actor)) {
        actor.setAction(classAction);
      }
    }
  }
  
  return wrapper;
}

let actionBar: ElementNode | null = null
let disposer: IReactionDisposer | null = null

export const addActionBar = async (actor: CreatureActorInterface, scene2d: SceneGraph2D) => {
  const createActionBar = () => {
    const status = statusBar(actor)
    const actions = actionItems(actor)

    const newActionBar = new FlexBox({
      flexDirection: 'column',
      position: 'absolute',
      left: '50%',
      transform: 'translate(-50%, 0)',
      bottom: 0,
    })

    newActionBar.nodes.push(status, actions)

    scene2d.replaceNode(actionBar, newActionBar)

    actionBar = newActionBar
  }

  if (disposer !== null) {
    disposer()
    disposer = null
  }

  disposer = autorun(createActionBar)
}
