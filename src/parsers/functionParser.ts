// ============================================================================
// FILE: src/parsers/functionParser.ts
// Function call parsing logic
// ============================================================================

import { FunctionCall } from '../types/functionCall'

export class FunctionParser {
  static extractFunctionCalls(text: string): FunctionCall[] {
    const calls: FunctionCall[] = []

    // Handle assignment patterns: type var = func(args);
    const assignmentMatch = text.match(/^(?:(\w+)\s+)?(\w+)\s*=\s*(.+);$/)
    if (assignmentMatch) {
      const declaredType = assignmentMatch[1]
      const assignedVar = assignmentMatch[2]
      const expression = assignmentMatch[3]

      const expressionCalls = this.extractFromExpression(expression)
      expressionCalls.forEach((call) => {
        let returnType = 'int'
        if (declaredType === 'auto') {
          returnType = 'auto'
        } else if (declaredType) {
          returnType = declaredType
        }

        calls.push({
          funcName: call.funcName,
          args: call.args,
          returnType: returnType,
        })
      })
    }

    // Handle standalone function calls: func(args);
    const standaloneMatch = text.match(/^(\w+)\((.*)\);$/)
    if (standaloneMatch) {
      const funcName = standaloneMatch[1]
      const argsString = standaloneMatch[2]
      const args = this.parseArguments(argsString)

      calls.push({
        funcName: funcName,
        args: args,
        returnType: 'void',
      })
    }

    return calls
  }

  private static extractFromExpression(
    expression: string
  ): Array<{ funcName: string; args: string[] }> {
    const calls: Array<{ funcName: string; args: string[] }> = []
    const functionPattern = /(\w+)\s*\(/g
    let match

    while ((match = functionPattern.exec(expression)) !== null) {
      const funcName = match[1]
      const startPos = match.index + match[0].length - 1

      const endPos = this.findMatchingParen(expression, startPos)
      if (endPos !== -1) {
        const argsString = expression.substring(startPos + 1, endPos)
        const args = this.parseArguments(argsString)

        calls.push({ funcName, args })
      }
    }

    return calls
  }

  private static findMatchingParen(text: string, startPos: number): number {
    let parenCount = 1
    let pos = startPos + 1

    while (pos < text.length && parenCount > 0) {
      if (text[pos] === '(') {
        parenCount++
      } else if (text[pos] === ')') {
        parenCount--
      }
      pos++
    }

    return parenCount === 0 ? pos - 1 : -1
  }

  private static parseArguments(argsString: string): string[] {
    if (!argsString.trim()) {
      return []
    }

    const args: string[] = []
    let currentArg = ''
    let parenCount = 0
    let inQuotes = false
    let quoteChar = ''

    for (let i = 0; i < argsString.length; i++) {
      const char = argsString[i]

      if (!inQuotes && (char === '"' || char === "'")) {
        inQuotes = true
        quoteChar = char
        currentArg += char
      } else if (inQuotes && char === quoteChar) {
        inQuotes = false
        quoteChar = ''
        currentArg += char
      } else if (!inQuotes && char === '(') {
        parenCount++
        currentArg += char
      } else if (!inQuotes && char === ')') {
        parenCount--
        currentArg += char
      } else if (!inQuotes && char === ',' && parenCount === 0) {
        args.push(currentArg.trim())
        currentArg = ''
      } else {
        currentArg += char
      }
    }

    if (currentArg.trim()) {
      args.push(currentArg.trim())
    }

    return args
  }
}
