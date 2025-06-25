import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage('🔧 FuncGenie is Active');

  const disposable = vscode.workspace.onDidChangeTextDocument((event) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || event.document !== editor.document) {return;}
    const changes = event.contentChanges;
    if (changes.length === 0) {return;}

    const change = changes[0];
    const line = editor.document.lineAt(change.range.start.line);
    const currentText = line.text.trim();
    console.log('📝 Typed Line:', currentText);

    // Detect assignment or standalone call
    const assignmentMatch = currentText.match(
      /^(?:(\w+)\s+)?(\w+)\s*=\s*(\w+)\((.*)\);$/
    );
    const callMatch = currentText.match(/^(\w+)\((.*)\);$/);

    let funcName = '';
    let argsRaw: string[] = [];
    let returnType = 'int';

    if (assignmentMatch) {
      const declaredType = assignmentMatch[1];
      const assignedVar = assignmentMatch[2];
      funcName = assignmentMatch[3];
      argsRaw = assignmentMatch[4]
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s);
      returnType =
        declaredType ||
        getTypeFromContext(assignedVar, editor, line.lineNumber) ||
        'int';
      console.log(`🧠 Inferred return type: ${returnType}`);
    } else if (callMatch) {
      funcName = callMatch[1];
      argsRaw = callMatch[2]
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s);
    } else {
      return;
    }

    // Infer arg types
    const variableTypes = getVariableTypesAbove(editor, line.lineNumber);
    const inferredArgs = argsRaw.map((arg, i) => {
      if (arg in variableTypes) {return `${variableTypes[arg]} ${arg}`;}
      if (/^".*"$/.test(arg)) {return `string arg${i}`;}
      if (/^\d+$/.test(arg)) {return `int arg${i}`;}
      if (/^\d+\.\d+$/.test(arg)) {return `double arg${i}`;}
      if (/^'.'$/.test(arg)) {return `char arg${i}`;}
      if (/^(true|false)$/.test(arg)) {return `bool arg${i}`;}
      return `int ${arg}`;
    });

    // Build signature
    const funcSignature =
      `${returnType} ${funcName}(${inferredArgs.join(', ')}) {\n` +
      `    // TODO: implement ${funcName}()\n` +
      `}\n\n`;

    const insertLine = findMainInsertLine(editor);

    // Check existing stubs above main
    const stubRange = findExistingStubRange(editor, insertLine, funcName);
    editor.edit((editBuilder) => {
      if (stubRange) {
        // Replace existing stub
        editBuilder.replace(stubRange, funcSignature);
        console.log(`🔄 Updated existing stub for ${funcName}`);
      } else {
        // Insert new
        editBuilder.insert(new vscode.Position(insertLine, 0), funcSignature);
        console.log(`📍 Inserted new stub for ${funcName}`);
      }
    });

    vscode.window.showInformationMessage(
      `✨ FuncGenie processed: ${funcName}()`
    );
  });
  context.subscriptions.push(disposable);
}

export function deactivate() {}

// Helpers:
function findExistingStubRange(
  editor: vscode.TextEditor,
  insertLine: number,
  funcName: string
): vscode.Range | null {
  const doc = editor.document;
  const regex = new RegExp(`^\\s*\\w+\\s+${funcName}\\s*\\(.*\\)\\s*\\{`);
  let start: vscode.Position | null = null;
  let end: vscode.Position | null = null;
  for (let i = 0; i < insertLine; i++) {
    const text = doc.lineAt(i).text;
    if (regex.test(text)) {
      start = new vscode.Position(i, 0);
      for (let j = i + 1; j < doc.lineCount; j++) {
        if (doc.lineAt(j).text.trim() === '}') {
          end = new vscode.Position(j + 1, 0);
          break;
        }
      }
      break;
    }
  }
  return start && end ? new vscode.Range(start, end) : null;
}

function getVariableTypesAbove(
  editor: vscode.TextEditor,
  lineNumber: number
): Record<string, string> {
  const ctx: Record<string, string> = {};
  const reg = /^(string|int|double|char|bool|float)\s+(\w+)/;
  for (let i = 0; i < lineNumber; i++) {
    const line = editor.document.lineAt(i).text.trim();
    const m = line.match(reg);
    if (m) {ctx[m[2]] = m[1];}
  }
  return ctx;
}

function getTypeFromContext(
  varName: string,
  editor: vscode.TextEditor,
  lineNumber: number
): string | undefined {
  const reg = new RegExp(
    `^(string|int|double|char|bool|float)\\s+${varName}\\b`
  );
  for (let i = 0; i < lineNumber; i++) {
    const line = editor.document.lineAt(i).text.trim();
    const m = line.match(reg);
    if (m) {return m[1];}
  }
  return undefined;
}

function findMainInsertLine(editor: vscode.TextEditor): number {
  const rc = editor.document.lineCount;
  for (let i = 0; i < rc; i++) {
    const t = editor.document.lineAt(i).text;
    if (/\b(?:signed\s+)?(?:int\s+)?main\s*\(/.test(t)) {return i;}
  }
  return 0;
}
// hi