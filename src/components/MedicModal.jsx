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
  formRef,
  onClose = () => {},
  onCancel = () => {},
  onSubmit = () => {},
}, ref) => (
  <Dialog open={showModal} onClose={onClose} keepMounted disablePortal ref={ref}>
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
        onSubmit={onSubmit}
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

        <input name="uuid" type="text" />

        <DialogActions>
          <Button variant="outlined" type="submit">
            {alt ? 'Modifier' : 'Ajouter'}
          </Button>
          <Button variant="outlined" color="warning" onClick={onCancel}>
            Annuler
          </Button>
        </DialogActions>
      </Stack>
    </DialogContent>
  </Dialog>
));

export default MedicModal;
