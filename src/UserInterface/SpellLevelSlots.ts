import UI from "./CreateElement"

type PropsType = {
  maxSpellSlots: number,
  available: number,
}

export const spellLevelSlots: UI.FC<PropsType> = ({ maxSpellSlots, available }) => {
  const elements: UI.UIElement[] = []

  for (let i = 0; i < maxSpellSlots; i += 1) {
    const style = {
      width: 16,
      height: 32,
      margin: { left: 0.5, right: 0.5 },
      border: { color: [0.75, 0.75, 0, 1], width: 1 },
      backgroundColor: i < available ? [0.75, 0.75, 0, 1] : [0, 0, 0, 1],
    }

    elements.push(
      UI.createElement('', { style })
    )
  }

  return UI.createElement('', {}, ...elements)
}