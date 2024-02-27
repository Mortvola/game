import { IReactionDisposer, autorun } from "mobx"
import ElementNode from "../Renderer/Drawables/SceneNodes/ElementNode"
import { FocusInfo } from "../types"
import SceneGraph2D from "../Renderer/SceneGraph2d"
import { createElement } from "./CreateElement"

const getStatus = (focused: FocusInfo) => {
  const style = {
    flexDirection: 'row',
    columnGap: 32,
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translate(-50%, 0)',
  }
  
  return createElement(
    '',
    { style },
    focused.name,
    `HP: ${focused.hitpoints}/${focused.maxHitpoints} ${focused.temporaryHitpoints ? ` + ${focused.temporaryHitpoints}` : ''}`,
    `AC: ${focused.armorClass}`,
    createElement(
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
      status = getStatus(focused)
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

