import { IReactionDisposer, autorun } from "mobx"
import ElementNode, { Style } from "../Renderer/Drawables/SceneNodes/ElementNode"
import { CreatureActorInterface } from "../types"
import SceneGraph2D from "../Renderer/SceneGraph2d"
import UI from "./CreateElement"

type PropsType = {
  actor: CreatureActorInterface
}

const getStatus: UI.FC<PropsType> = ({ actor }) => {
  const style: Style = {
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    bottom: 0,
    padding: { left: 16, bottom: 16 },
  }
  
  return UI.createElement(
    '',
    { style },
    ...actor.character.influencingActions.map((c) => (
      `${c.name} (${c.duration / 6})`
    )),
    ...actor.character.conditions.map((c) => (
      c
    )),
    actor.character.concentration
      ? `Concetrating: ${actor.character.concentration.name} (${actor.character.concentration.duration / 6})`
      : null,
    UI.createElement(
      '',
      { style: { flexDirection: 'column' } },
      actor.character.name,
      `${actor.character.hitPoints}/${actor.character.maxHitPoints} ${actor.character.temporaryHitPoints ? ` + ${actor.character.temporaryHitPoints}` : ''}`
    )
  )
}

let playerStatus: ElementNode | null = null
let disposer: IReactionDisposer | null = null

export const addPlayerStatus = async (actor: CreatureActorInterface | null, scene2d: SceneGraph2D) => {
  const createActionBar = () => {
    let status: ElementNode | null = null

    if (actor) {
      status = UI.render(getStatus({ actor }), scene2d)
    }

    scene2d.replaceNode(playerStatus, status)
    playerStatus = status
  }

  if (disposer !== null) {
    disposer()
    disposer = null
  }

  disposer = autorun(createActionBar)
}
