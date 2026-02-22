import React, { useRef } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ language, value, onChange, editorTheme }) => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Block paste shortcut completely
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => {
      console.log("Paste blocked");
    });

    // Block context menu (right-click paste)
    editor.onContextMenu((e) => {
      e.preventDefault();
    });
  };

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={onChange}
      theme={editorTheme}
      onMount={handleEditorDidMount}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        automaticLayout: true,
        wordWrap: "on",
        renderWhitespace: "all",
        contextmenu: false,
        pasteAsPlainText: true,
      }}
    />
  );
};

export default CodeEditor;