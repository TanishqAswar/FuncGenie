// ============================================================================
// FILE: src/generators/stubGenerator.ts
// Function stub generation
// ============================================================================

export class StubGenerator {
  static generateFunctionStub(
    funcName: string,
    args: string[],
    returnType: string
  ): string {
    const defaultReturnValue = this.getDefaultReturnValue(returnType)

    const signature = `${returnType} ${funcName}(${args.join(', ')}) {\n`
    const todoComment = `    // TODO: implement ${funcName}()\n`
    const returnStatement =
      returnType !== 'void' ? `    return ${defaultReturnValue};\n` : ''
    const closing = `}\n\n`

    return signature + todoComment + returnStatement + closing
  }

  private static getDefaultReturnValue(returnType: string): string {
    switch (returnType.toLowerCase()) {
      case 'int':
      case 'long':
      case 'long long':
      case 'll':
      case 'short':
      case 'size_t':
        return '0'
      case 'double':
      case 'float':
        return '0.0'
      case 'bool':
        return 'false'
      case 'char':
        return "'\\0'"
      case 'string':
        return '""'
      case 'auto':
        return '0  // Change this based on actual return type needed'
      default:
        // Handle container types
        if (this.isContainerType(returnType)) {
          return '{}'
        }
        return '{}  // Default initialization'
    }
  }

  private static isContainerType(returnType: string): boolean {
    const containerKeywords = [
      'vector',
      'set',
      'unordered_set',
      'map',
      'unordered_map',
      'deque',
      'list',
      'pair',
      'priority_queue',
      'queue',
      'stack',
      'array',
    ]

    return containerKeywords.some((keyword) => returnType.includes(keyword))
  }
}
