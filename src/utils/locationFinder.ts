// ============================================================================
// FILE: src/utils/locationFinder.ts
// Location finding utilities
// ============================================================================

import * as vscode from 'vscode'

export class LocationFinder {
  static findCurrentFunctionStart(
    editor: vscode.TextEditor,
    currentLine: number
  ): number {
    const doc = editor.document

    for (let i = currentLine; i >= 0; i--) {
      const text = doc.lineAt(i).text.trim()

      // Check for function signature patterns
      if (this.isFunctionSignature(text)) {
        return i
      }

      // Check for multi-line function signatures
      if (this.isMultiLineFunctionStart(doc, i)) {
        return i
      }
    }

    return 0 // Insert at beginning if no function found
  }

  static findExistingStubRange(
    editor: vscode.TextEditor,
    insertLine: number,
    funcName: string
  ): vscode.Range | null {
    const doc = editor.document
    const regex = new RegExp(`^\\s*\\w+\\s+${funcName}\\s*\\(.*\\)\\s*\\{`)

    for (let i = 0; i < insertLine; i++) {
      const text = doc.lineAt(i).text
      if (regex.test(text)) {
        const start = new vscode.Position(i, 0)

        // Find the end of this function stub
        for (let j = i + 1; j < doc.lineCount; j++) {
          if (doc.lineAt(j).text.trim() === '}') {
            const end = new vscode.Position(j + 1, 0)
            return new vscode.Range(start, end)
          }
        }
      }
    }

    return null
  }

  private static isFunctionSignature(text: string): boolean {
    // Check for standard function signatures
    const patterns = [
      /^\w+\s+\w+\s*\([^)]*\)\s*\{?\s*$/,
      /\b(?:signed\s+)?(?:int\s+)?main\s*\([^)]*\)\s*\{?\s*$/,
    ]

    return patterns.some((pattern) => pattern.test(text))
  }

  private static isMultiLineFunctionStart(
    doc: vscode.TextDocument,
    lineIndex: number
  ): boolean {
    const text = doc.lineAt(lineIndex).text.trim()

    if (!/^\w+\s+\w+\s*\([^)]*$/.test(text)) {
      return false
    }

    // Look for the closing parenthesis and opening brace
    let j = lineIndex + 1
    while (j < doc.lineCount) {
      const nextText = doc.lineAt(j).text.trim()
      if (nextText.includes('{')) {
        return true
      }
      if (nextText.includes(')')) {
        j++
        break
      }
      j++
    }

    return j < doc.lineCount && doc.lineAt(j).text.trim().includes('{')
  }
}
