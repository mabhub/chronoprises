import React from 'react';
import { TextField } from '@mui/material';

export const defaultSlotProps = { inputLabel: { shrink: true } };

const CustomTextField = React.forwardRef((props, ref) => (
  <TextField
    ref={ref}
    size="small"
    slotProps={defaultSlotProps}
    {...props}
  />
));

export default CustomTextField;
