export const tokens = {
  colors: {
    light: {
      background: '#eef5f3',
      surface:    '#f7fbfa',
      text:       '#1c3830',
      textMuted:  '#4d6e66',
      heading:    '#112b22',
      primary:    '#2a6655',
      accent:     '#b46810',
      border:     '#bcd6d0',
      muted:      '#cfe3de',
    },
    dark: {
      background: '#0e1f19',
      surface:    '#152820',
      text:       '#e2ede7',
      textMuted:  '#79a896',
      heading:    '#f2ece0',
      primary:    '#5eb3a3',
      accent:     '#d4901a',
      border:     '#24413a',
      muted:      '#1c3328',
    },
  },

  typography: {
    fontFamily: {
      sans:    'Inter Variable, system-ui, sans-serif',
      serif:   'Lora Variable, Georgia, serif',
      display: 'Lora Variable, Georgia, serif',
    },
    sizes: {
      base: '1rem',
      lg:   '1.125rem',
      xl:   '1.25rem',
      '2xl':'1.5rem',
      '3xl':'2rem',
      '4xl':'2.5rem',
      '5xl':'3rem',
      '6xl':'3.75rem',
    },
  },

  radius: {
    sm: '0.375rem',
    md: '0.625rem',
    lg: '0.875rem',
    xl: '1.125rem',
  },
} as const;
