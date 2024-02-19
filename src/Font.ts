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

class Font {
  chars: Map<string, Character> = new Map()

  textuerWidth = 512;

  textureHeight = 512;

  private constructor(config: { chars: Character[] }) {
    for (let character of config.chars) {
      this.chars.set(character.char, character)
    }
  }

  static async create() {
    let config: { chars: Character[] } | undefined = undefined

    const response = await Http.get<{ chars: Character[] }>('/fonts/OpenSans-Regular-msdf.json')

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
    let top = 0;
    let height = 0;

    for (const char of text) {
      const character = this.chars.get(char)

      if (character) {
        const numVertices = vertices.length / 2;

        vertices.push(width, top)
        vertices.push(width, top + character.height)
        vertices.push(width + character.width, top + character.height)
        vertices.push(width + character.width, top)

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

        width += character.width
        height = Math.max(height, character.height)
      }
    }

    return new Mesh2D(vertices, texcoords, indexes, width, height)
  }
}

export const font = await Font.create()

export default Font

