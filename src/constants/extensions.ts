import { Extension } from '../types';

export const INITIAL_EXTENSIONS: Extension[] = [
  {
    id: 'python-support',
    name: 'Python',
    publisher: 'Microsoft',
    description: 'Python language support with syntax highlighting, IntelliSense, and linting.',
    version: '2024.2.0',
    icon: 'Terminal',
    installed: false,
    rating: 4.8,
    downloads: '112M',
    categories: ['Programming Languages'],
    contributions: {
      commands: [
        { id: 'python.runFile', label: 'Python: Run Python File' },
        { id: 'python.selectInterpreter', label: 'Python: Select Interpreter' }
      ],
      languages: [
        { id: 'python', extensions: ['.py'], icon: 'Terminal' }
      ]
    }
  },
  {
    id: 'prettier',
    name: 'Prettier - Code formatter',
    publisher: 'Prettier',
    description: 'An opinionated code formatter. It enforces a consistent style by parsing your code.',
    version: '10.1.0',
    icon: 'Layout',
    installed: false,
    rating: 4.5,
    downloads: '38M',
    categories: ['Formatters'],
    contributions: {
      commands: [
        { id: 'prettier.formatFile', label: 'Format Document (with Prettier)' }
      ]
    }
  },
  {
    id: 'eslint',
    name: 'ESLint',
    publisher: 'Microsoft',
    description: 'Integrates ESLint JavaScript into VS Code.',
    version: '2.4.2',
    icon: 'Shield',
    installed: false,
    rating: 4.7,
    downloads: '52M',
    categories: ['Linters']
  },
  {
    id: 'jupyter',
    name: 'Jupyter',
    publisher: 'Microsoft',
    description: 'Jupyter notebook support and interactive computing for VS Code.',
    version: '2024.1.0',
    icon: 'BookOpen',
    installed: false,
    rating: 4.4,
    downloads: '65M',
    categories: ['Data Science']
  },
  {
    id: 'gitlens',
    name: 'GitLens — Git supercharged',
    publisher: 'GitKraken',
    description: 'Supercharge Git within VS Code — Visualize code authorship at a glance.',
    version: '14.0.0',
    icon: 'GitBranch',
    installed: false,
    rating: 4.9,
    downloads: '28M',
    categories: ['Source Control'],
    contributions: {
      views: [
        { id: 'gitlens.home', title: 'GitLens' },
        { id: 'gitlens.commits', title: 'Commits' }
      ],
      commands: [
        { id: 'gitlens.showHistory', label: 'GitLens: Show File History' }
      ]
    }
  },
  {
    id: 'docker',
    name: 'Docker',
    publisher: 'Microsoft',
    description: 'Adds syntax highlighting, commands, and more to your Docker projects.',
    version: '1.27.0',
    icon: 'Box',
    installed: false,
    rating: 4.6,
    downloads: '24M',
    categories: ['Containers']
  }
];
