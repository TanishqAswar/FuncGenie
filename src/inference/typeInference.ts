// ============================================================================
// FILE: src/inference/typeInference.ts
// Type inference logic
// ============================================================================

import * as vscode from 'vscode'
import { TypedefExpander } from '../utils/typedefExpander'

export class TypeInference {
  static inferArgumentTypes(
    args: string[],
    variableTypes: Record<string, string>
  ): string[] {
    return args.map((arg, index) => {
      // Check if it's a known variable
      if (/^\w+$/.test(arg) && arg in variableTypes) {
        return `${variableTypes[arg]} ${arg}`
      }

      // Check if it's a function call
      if (arg.includes('(') && arg.includes(')')) {
        return `int arg${index}`
      }

      // Check literal types
      if (/^".*"$/.test(arg)) return `string arg${index}`
      if (/^\d+$/.test(arg)) return `int arg${index}`
      if (/^\d+\.\d+$/.test(arg)) return `double arg${index}`
      if (/^'.'$/.test(arg)) return `char arg${index}`
      if (/^(true|false)$/.test(arg)) return `bool arg${index}`

      // Default case
      return `int ${arg}`
    })
  }

  static getVariableTypesAbove(
    editor: vscode.TextEditor,
    lineNumber: number
  ): Record<string, string> {
    const ctx: Record<string, string> = {}

    const patterns = [
      // Complex container types
      /^(vector<(?:int|long long|ll|double|float|char|string|bool)>|vector<pair<(?:int|long long|ll|double|float|char|string|bool),\s*(?:int|long long|ll|double|float|char|string|bool)>>|map<(?:int|long long|ll|double|float|char|string|bool),\s*(?:int|long long|ll|double|float|char|string|bool)>|unordered_map<(?:int|long long|ll|double|float|char|string|bool),\s*(?:int|long long|ll|double|float|char|string|bool)>|set<(?:int|long long|ll|double|float|char|string|bool)>|set<pair<(?:int|long long|ll|double|float|char|string|bool),\s*(?:int|long long|ll|double|float|char|string|bool)>>|unordered_set<(?:int|long long|ll|double|float|char|string|bool)>|pair<(?:int|long long|ll|double|float|char|string|bool),\s*(?:int|long long|ll|double|float|char|string|bool)>|priority_queue<(?:int|long long|ll|double|float|char|string|bool)>|queue<(?:int|long long|ll|double|float|char|string|bool)>|stack<(?:int|long long|ll|double|float|char|string|bool)>|deque<(?:int|long long|ll|double|float|char|string|bool)>)\s+(\w+)/,

      // Basic types and custom typedefs
      /^(string|int|double|char|bool|float|auto|long\s+long|long|short|size_t|ll|vi|vd|vf|vc|vs|vb|vll|vpi|vpd|vpl|vpc|vps|vpb|vpll|mii|mid|mil|mic|mis|mib|mill|mdi|mdd|mdl|mdc|mds|mdb|mdll|mli|mld|mll|mlc|mls|mlb|mlll|mci|mcd|mcl|mcc|mcs|mcb|mcll|msi|msd|msl|msc|mss|msb|msll|mbi|mbd|mbl|mbc|mbs|mbb|mbll|mlli|mlld|mlll|mllc|mlls|mllb|mllll|umii|umid|umil|umic|umis|umib|umill|umdi|umdd|umdl|umdc|umds|umdb|umdll|umli|umld|umll|umlc|umls|umlb|umlll|umci|umcd|umcl|umcc|umcs|umcb|umcll|umsi|umsd|umsl|umsc|umss|umsb|umsll|umbi|umbd|umbl|umbc|umbs|umbb|umbll|umlli|umlld|umlll|umllc|umlls|umllb|umllll|si|sd|sl|sc|ss|sb|sll|spi|spd|spl|spc|sps|spb|spll|usi|usd|usl|usc|uss|usb|usll|pii|pid|pil|pic|pis|pib|pill|pdi|pdd|pdl|pdc|pds|pdb|pdll|pli|pld|pll|plc|pls|plb|plll|pci|pcd|pcl|pcc|pcs|pcb|pcll|psi|psd|psl|psc|pss|psb|psll|pbi|pbd|pbl|pbc|pbs|pbb|pbll|plli|plld|plll|pllc|plls|pllb|pllll)\s+(\w+)/,
    ]

    for (let i = 0; i < lineNumber; i++) {
      const line = editor.document.lineAt(i).text.trim()

      for (const pattern of patterns) {
        const match = line.match(pattern)
        if (match) {
          const actualType = TypedefExpander.expand(match[1])
          ctx[match[2]] = actualType
          break
        }
      }
    }

    return ctx
  }
}
