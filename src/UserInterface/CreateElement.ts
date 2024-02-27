import ElementNode, { Style } from "../Renderer/Drawables/SceneNodes/ElementNode"
import SceneNode2d from "../Renderer/Drawables/SceneNodes/SceneNode2d"
import TextBox from "../Renderer/Drawables/SceneNodes/TextBox"

export function createElement<T>(
  type: string | ((props: T) => ElementNode),
  props: T,
  ...children: (ElementNode | ElementNode[] | string | null)[]
): ElementNode {
  if (typeof type === 'string') {
    const parent = new ElementNode((props as { style?: Style}).style)

    parent.onClick = (props as { onClick?: () => void }).onClick

    parent.nodes.push(
      ...children.flatMap((c) => {
        if (typeof c === 'string') {
          return new TextBox(c)
        }

        return c
      })
      .filter((c) => c !== null) as SceneNode2d[]
    )

    return parent;
  }

  return type(props)
}
