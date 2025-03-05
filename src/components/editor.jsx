import React, { useRef, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";

function Editor({ code, onCodeChange, language }) {
  const editorRef = useRef(null);

  // Handle editor mount (get editor instance)
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  // Handle code change (to keep the cursor position)
  const handleChange = (newCode) => {
    if (editorRef.current) {
      const position = editorRef.current.getPosition(); // Save cursor position
      onCodeChange(newCode); // Update the code
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.setPosition(position); // Restore cursor
          editorRef.current.focus(); // Keep focus in editor
        }
      }, 0);
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      // Whenever the language prop changes, set the language of the editor
      editorRef.current.getModel().setMode(language);
    }
  }, [language]); // Run this effect whenever the language changes

  return (
    <MonacoEditor
      height="80vh"
      language={language} // Dynamically set the language based on the prop
      theme="vs-dark"
      value={code}
      onChange={handleChange}
      onMount={handleEditorDidMount}
      options={{
        fontSize: 16,
        minimap: { enabled: false },
        automaticLayout: true,
      }}
    />
  );
}

export default Editor;
