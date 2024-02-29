import { IReactionDisposer, autorun } from "mobx"
import ElementNode, { Style } from "../Renderer/Drawables/SceneNodes/ElementNode"
import { FocusInfo } from "../types"
import SceneGraph2D from "../Renderer/SceneGraph2d"
import UI from "./CreateElement"

const getStatus = (focused: FocusInfo) => {
  const style: Style = {
    flexDirection: 'row',
    columnGap: 32,
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translate(-50%, 0)',
  }
  
  return UI.createElement(
    '',
    { style },
    focused.name,
    `HP: ${focused.hitpoints}/${focused.maxHitpoints} ${focused.temporaryHitpoints ? ` + ${focused.temporaryHitpoints}` : ''}`,
    `AC: ${focused.armorClass}`,
    UI.createElement(
      '',
      {},
      ...focused.conditions.map((c) => (
        `${c.name} (${c.duration / 6})`
      )),
    )
  )
}

let focusedStatus: ElementNode | null = null
let disposer: IReactionDisposer | null = null

export const addFocusedStatus = async (focused: FocusInfo | null, scene2d: SceneGraph2D) => {
  const createActionBar = () => {
    let status: ElementNode | null = null

    if (focused) {
      const temp = getStatus(focused)

      status = UI.render(temp, scene2d)
    }

    scene2d.replaceNode(focusedStatus, status)
    focusedStatus = status
  }

  if (disposer !== null) {
    disposer()
    disposer = null
  }

  disposer = autorun(createActionBar)
}

