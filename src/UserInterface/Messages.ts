import { IReactionDisposer, autorun } from "mobx"
import ElementNode from "../Renderer/Drawables/SceneNodes/ElementNode"
import SceneGraph2D from "../Renderer/SceneGraph2d"
import { createElement } from "./CreateElement"

type PropsType = {
  messages: { id: number, message: string }[],
}

const getMessages = ({ messages }: PropsType) => {
  const style = {
    flexDirection: 'column',
    position: 'absolute',
    right: 0,
    bottom: 0,
    padding: { bottom: 16, right: 16 },
  }

  return createElement(
    '',
    { style },
    ...messages.map((m) => (
      m.message
    ))
  )
}

let messageLog: ElementNode | null = null
let disposer: IReactionDisposer | null = null

export const addMessages = async (messages: { id: number, message: string }[], scene2d: SceneGraph2D) => {
  const createMessages = () => {
    let log: ElementNode | null = null

    log = getMessages({ messages })

    scene2d.replaceNode(messageLog, log)
    messageLog = log
  }

  if (disposer !== null) {
    disposer()
    disposer = null
  }

  disposer = autorun(createMessages)
}

