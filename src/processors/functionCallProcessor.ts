// ============================================================================
// FILE: src/processors/functionCallProcessor.ts
// Main processing logic
// ============================================================================

import * as vscode from 'vscode'
import { FunctionCall } from '../types/functionCall'
import { FunctionParser } from '../parsers/functionParser'
import { TypeInference } from '../inference/typeInference'
import { StubGenerator } from '../generators/stubGenerator'
import { LocationFinder } from '../utils/locationFinder'

export class FunctionCallProcessor {
  private lastProcessedLine: number = -1
  private lastProcessedFunction: string = ''
  private processedFunctions: Set<string> = new Set()

  processTextChange(
    editor: vscode.TextEditor,
    change: vscode.TextDocumentContentChangeEvent
  ) {
    const line = editor.document.lineAt(change.range.start.line)
    const currentText = line.text.trim()

    console.log('📝 Typed Line:', currentText)

    // Extract function calls from the current line
    const functionCalls = FunctionParser.extractFunctionCalls(currentText)
    if (functionCalls.length === 0) {
      return
    }

    // Process each function call
    functionCalls.forEach((funcCall) => {
      this.processFunctionCall(editor, line, funcCall, change)
    })
  }

  private processFunctionCall(
    editor: vscode.TextEditor,
    line: vscode.TextLine,
    funcCall: FunctionCall,
    change: vscode.TextDocumentContentChangeEvent
  ) {
    const { funcName, args, returnType } = funcCall

    // Skip if we've already processed this function recently
    if (this.shouldSkipProcessing(funcName, line.lineNumber)) {
      return
    }

    // Get variable types from context
    const variableTypes = TypeInference.getVariableTypesAbove(
      editor,
      line.lineNumber
    )
    const inferredArgs = TypeInference.inferArgumentTypes(args, variableTypes)

    // Generate function stub
    const funcSignature = StubGenerator.generateFunctionStub(
      funcName,
      inferredArgs,
      returnType
    )

    // Find where to insert the stub
    const insertLine = LocationFinder.findCurrentFunctionStart(
      editor,
      line.lineNumber
    )

    // Check for existing stub
    const existingStubRange = LocationFinder.findExistingStubRange(
      editor,
      insertLine,
      funcName
    )

    // Insert or update the stub
    editor.edit((editBuilder) => {
      if (existingStubRange) {
        // Update existing stub
        editBuilder.replace(existingStubRange, funcSignature)
        console.log(`🔄 Updated existing stub for ${funcName}`)
      } else {
        // Insert new stub
        editBuilder.insert(new vscode.Position(insertLine, 0), funcSignature)
        console.log(`📍 Inserted new stub for ${funcName}`)
      }
    })

    // Update tracking variables
    this.lastProcessedLine = line.lineNumber
    this.lastProcessedFunction = funcName
    this.processedFunctions.add(funcName)

    vscode.window.showInformationMessage(
      `✨ FuncGenie processed: ${funcName}()`
    )
  }

  private shouldSkipProcessing(funcName: string, currentLine: number): boolean {
    // Skip if we're processing the same function on the same line
    if (
      funcName === this.lastProcessedFunction &&
      currentLine === this.lastProcessedLine
    ) {
      return true
    }

    // Skip if we're making minor edits to the same line
    if (
      Math.abs(currentLine - this.lastProcessedLine) <= 1 &&
      this.processedFunctions.has(funcName)
    ) {
      return true
    }

    return false
  }

  cleanup() {
    this.processedFunctions.clear()
  }
}
