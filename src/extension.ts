// ============================================================================
// FILE: src/extension.ts
// Main extension entry point
// ============================================================================

import * as vscode from 'vscode'
import { FunctionCallProcessor } from './processors/functionCallProcessor'

let processor: FunctionCallProcessor

export function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage('🔧 FuncGenie is Active')

  processor = new FunctionCallProcessor()

  const disposable = vscode.workspace.onDidChangeTextDocument((event) => {
    const editor = vscode.window.activeTextEditor
    if (!editor || event.document !== editor.document) {
      return
    }

    const changes = event.contentChanges
    if (changes.length === 0) {
      return
    }

    processor.processTextChange(editor, changes[0])
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {
  if (processor) {
    processor.cleanup()
  }
}
