import React from 'react';
import { Button, createTheme, ThemeProvider } from '@mui/material';

const ColorButton = React.forwardRef(({
  color = '#aaa',
  sx = {},
  ...props
}, ref) => {
  const localTheme = createTheme({ palette: { primary: { main: color } } });

  return (
    <ThemeProvider theme={localTheme}>
      <Button
        ref={ref}
        sx={{
          textTransform: 'none',
          ...sx,
        }}
        {...props}
      />
    </ThemeProvider>
  );
});

export default ColorButton;
