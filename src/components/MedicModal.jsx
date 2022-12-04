import React from 'react';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Stack,
  colors,
} from '@mui/material';

import CustomTextField from './CustomTextField';

const MedicModal = React.forwardRef(({
  open: showModal,
  alt,
  onClose = () => {},
  onSubmit = () => {},
  initialValues,
}, ref) => {
  const formRef = React.useRef();

  React.useEffect(
    () => {
      if (!formRef.current) return;

      formRef.current.reset();
      Object.entries(initialValues).forEach(([field, value]) => {
        formRef.current.elements[field].value = value;
      });
    },
    [initialValues],
  );

  const handleFormSubmit = event => {
    event.preventDefault();
    const data = new FormData(event.target);
    const formEntries = Object.fromEntries(
      Array.from(data.entries()).filter(({ 1: value }) => value),
    );

    if (event.target.reportValidity()) {
      event.target.reset();
      onSubmit(formEntries);
    }
  };

  return (
    <Dialog open={showModal} onClose={onClose} ref={ref} keepMounted>
      <DialogTitle>
        {alt ? 'Modifier' : 'Ajouter'} un médicament
      </DialogTitle>

      <DialogContent>
        <Stack
          component="form"
          noValidate
          autoComplete="off"
          sx={{ mt: 2 }}
          spacing={2}
          onSubmit={handleFormSubmit}
          ref={formRef}
        >
          <Stack direction="row" spacing={1}>
            <CustomTextField
              label="Nom du médicament"
              name="primary"
              placeholder="Doliprane 1000mg"
              required
              sx={{ flex: 1 }}
            />

            <CustomTextField
              helperText="entre chaque prise"
              name="delay"
              placeholder="6"
              sx={{
                width: '14ch',
              }}
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                sx: { textAlign: 'center' },
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end">heures</InputAdornment>,
              }}
              FormHelperTextProps={{
                sx: { textAlign: 'right', mt: 0, mr: 0 },
              }}
            />
          </Stack>

          <CustomTextField
            label="Info supplémentaire"
            name="secondary"
            placeholder="Maximum 4 par 24h"
            multiline
            fullWidth
          />

          <CustomTextField
            label="Couleur"
            name="color"
            placeholder="#abcedf"
          />

          <Box>
            {[200, 500, 900].map(colorIndex => (
              <Box key={colorIndex} sx={{ lineHeight: 1, textAlign: 'center' }}>
                {Object.entries(colors).slice(-15).map(([name, values]) => (
                  <Box
                    key={name}
                    sx={{
                      display: 'inline-block',
                      verticalAlign: 'middle',
                      width: 'calc(100% / 15)',
                      height: 20,
                      bgcolor: values[colorIndex],
                      cursor: 'pointer',
                      borderRadius: 0.5,
                      border: '2px solid transparent',
                      '&:hover': {
                        borderColor: values[(colorIndex + 300) % 900],
                      },
                    }}
                    // eslint-disable-next-line prefer-destructuring
                    onClick={() => { formRef.current.elements.color.value = values[colorIndex]; }}
                  />
                ))}
              </Box>
            ))}
          </Box>

          <Box component="input" name="uuid" type="text" sx={{ display: 'none' }} />

          <DialogActions>
            <Button variant="outlined" type="submit">
              {alt ? 'Modifier' : 'Ajouter'}
            </Button>

            <Button variant="outlined" color="warning" onClick={onClose}>
              Annuler
            </Button>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
});

export default MedicModal;
