import { ThemeDefinition } from '../types';

export const CORE_THEMES: ThemeDefinition[] = [
  {
    id: 'elegant-dark',
    name: 'Elegant Dark',
    type: 'dark',
    colors: {
      'editor.background': '#151515',
      'editor.foreground': '#e0e0e0',
      'editorCursor.foreground': '#007acc',
      'editor.lineHighlightBackground': '#1a1a1a',
      'editorLineNumber.foreground': '#454545',
      'editor.selectionBackground': '#264f78',
      'sideBar.background': '#1e1e1e',
      'sideBar.border': '#333333',
      'activityBar.background': '#0a0a0a',
    },
    rules: [
      { token: 'comment', foreground: '#6a9955', fontStyle: 'italic' },
      { token: 'keyword', foreground: '#569cd6' },
      { token: 'variable', foreground: '#9cdcfe' },
      { token: 'string', foreground: '#ce9178' },
      { token: 'function', foreground: '#dcdcaa' },
      { token: 'type', foreground: '#4ec9b0' },
    ]
  },
  {
    id: 'one-dark',
    name: 'One Dark Pro',
    type: 'dark',
    colors: {
      'editor.background': '#282c34',
      'editor.foreground': '#abb2bf',
      'editorCursor.foreground': '#528bff',
      'editor.lineHighlightBackground': '#2c313a',
      'editorLineNumber.foreground': '#4b5263',
      'editor.selectionBackground': '#3e4451',
      'editorIndentGuide.background': '#3b4048',
    },
    rules: [
      { token: 'comment', foreground: '#5c6370', fontStyle: 'italic' },
      { token: 'keyword', foreground: '#c678dd' },
      { token: 'variable', foreground: '#e06c75' },
      { token: 'string', foreground: '#98c379' },
      { token: 'function', foreground: '#61afef' },
      { token: 'type', foreground: '#e5c07b' },
    ]
  },
  {
    id: 'dracula',
    name: 'Dracula',
    type: 'dark',
    colors: {
      'editor.background': '#282a36',
      'editor.foreground': '#f8f8f2',
      'editorCursor.foreground': '#f8f8f2',
      'editor.lineHighlightBackground': '#44475a',
      'editorLineNumber.foreground': '#6272a4',
      'editor.selectionBackground': '#44475a',
      'editorIndentGuide.background': '#44475a',
    },
    rules: [
      { token: 'comment', foreground: '#6272a4', fontStyle: 'italic' },
      { token: 'keyword', foreground: '#ff79c6' },
      { token: 'variable', foreground: '#f8f8f2' },
      { token: 'string', foreground: '#f1fa8c' },
      { token: 'function', foreground: '#50fa7b' },
      { token: 'type', foreground: '#8be9fd' },
    ]
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk 2077',
    type: 'dark',
    colors: {
      'editor.background': '#000b1e',
      'editor.foreground': '#00ffc8',
      'editorCursor.foreground': '#ff0055',
      'editor.lineHighlightBackground': '#001a3d',
      'editorLineNumber.foreground': '#001a3d',
      'editor.selectionBackground': '#ff005544',
    },
    rules: [
      { token: 'comment', foreground: '#323232' },
      { token: 'keyword', foreground: '#ff0055' },
      { token: 'variable', foreground: '#00ffc8' },
      { token: 'string', foreground: '#fff000' },
      { token: 'function', foreground: '#00ccff' },
    ]
  },
  {
    id: 'github-dark',
    name: 'GitHub Dark',
    type: 'dark',
    colors: {
      'editor.background': '#0d1117',
      'editor.foreground': '#c9d1d9',
      'editorCursor.foreground': '#58a6ff',
      'editor.lineHighlightBackground': '#161b22',
      'editorLineNumber.foreground': '#484f58',
      'editor.selectionBackground': '#264f78',
    },
    rules: [
      { token: 'comment', foreground: '#8b949e' },
      { token: 'keyword', foreground: '#ff7b72' },
      { token: 'variable', foreground: '#ffa657' },
      { token: 'string', foreground: '#a5d6ff' },
      { token: 'function', foreground: '#d2a8ff' },
    ]
  },
  {
    id: 'monokai',
    name: 'Monokai',
    type: 'dark',
    colors: {
      'editor.background': '#272822',
      'editor.foreground': '#f8f8f2',
      'editorCursor.foreground': '#f8f8f2',
      'editor.lineHighlightBackground': '#3e3d32',
      'editorLineNumber.foreground': '#90908a',
      'editor.selectionBackground': '#49483e',
    },
    rules: [
      { token: 'comment', foreground: '#75715e' },
      { token: 'keyword', foreground: '#f92672' },
      { token: 'variable', foreground: '#a6e22e' },
      { token: 'string', foreground: '#e6db74' },
      { token: 'function', foreground: '#66d9ef' },
    ]
  }
];
