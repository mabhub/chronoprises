import React from 'react';
import { TextField } from '@mui/material';

const CustomTextField = React.forwardRef(({ InputLabelProps = {}, ...props }, ref) => (
  <TextField
    ref={ref}
    size="small"
    InputLabelProps={{
      shrink: true,
      ...InputLabelProps,
    }}
    {...props}
  />
));

export default CustomTextField;
