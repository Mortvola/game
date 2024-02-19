import Http from "./Http/src"
import Mesh2D from "./Renderer/Drawables/Mesh2D";

type Character = {
  id: number,
  index: number,
  char: string,
  width: number,
  height: number,
  xoffset: number,
  yoffset: number,
  xadvance: number,
  chnl: number,
  x: number,
  y: number,
  page: number,
}

type FontConfig = {
  chars: Character[],
  info: { size: number },
  common: { scaleW: number, scaleH: number }
}

class Font {
  chars: Map<string, Character> = new Map()

  textuerWidth;

  textureHeight;

  fontSize: number;

  private constructor(config: FontConfig) {
    for (let character of config.chars) {
      this.chars.set(character.char, character)
    }

    this.textuerWidth = config.common.scaleW
    this.textureHeight = config.common.scaleH
    this.fontSize = config.info.size;
  }

  static async create() {
    let config: FontConfig | undefined = undefined

    const response = await Http.get<FontConfig>('/fonts/OpenSans-Regular-msdf.json')

    if (response.ok) {
      config = await response.body()
    }

    if (!config) {
      throw new Error('character config not downloaded')
    }

    return new Font(config)
  }

  text(text: string): Mesh2D {
    const vertices: number[] = [];
    const texcoords: number[] = [];
    const indexes: number[] = [];

    let width = 0;
    let height = 0;

    const scale = 16 / this.fontSize;

    for (const char of text) {
      const character = this.chars.get(char)

      if (character) {
        const numVertices = vertices.length / 2;

        const left = width + character.xoffset * scale
        const right = left + character.width * scale
        const top = character.yoffset * scale
        const bottom = top + character.height * scale

        vertices.push(left, top)
        vertices.push(left, bottom)
        vertices.push(right, bottom)
        vertices.push(right, top)

        texcoords.push(character.x / this.textuerWidth, character.y / this.textureHeight)
        texcoords.push(character.x / this.textuerWidth, (character.y + character.height) / this.textureHeight)
        texcoords.push((character.x + character.width) / this.textuerWidth, (character.y + character.height) / this.textureHeight)
        texcoords.push((character.x + character.width) / this.textuerWidth, character.y / this.textureHeight)
        
        indexes.push(
          numVertices + 0,
          numVertices + 1,
          numVertices + 3,
          numVertices + 3,
          numVertices + 1,
          numVertices + 2,
        )

        width += character.xadvance * scale
        height = Math.max(height, character.height * scale)
      }
    }

    return new Mesh2D(vertices, texcoords, indexes, width, height)
  }
}

export const font = await Font.create()

export default Font

