import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
  colors,
  ListItemSecondaryAction,
  ListSubheader,
  ToggleButtonGroup,
  ToggleButton,
  ThemeProvider,
  createTheme,
} from '@mui/material';

import {
  Add,
  AvTimer,
  Clear,
  Delete,
  DeleteForever,
  Done,
  Edit,
  FileUpload,
  GetApp,
  List as ListIcon,
  MoreHoriz,
} from '@mui/icons-material';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/fr';

import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line import/no-unresolved
import createPersistedState from 'use-persisted-state';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(updateLocale);
dayjs.locale('fr');

const useMedicationState = createPersistedState('medications');
const useShots = createPersistedState('shots');
const useMedicViewMode = createPersistedState('medicViewMode');

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

const ColorButton = React.forwardRef(({
  color,
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

const Home = () => {
  const [medications, setMedications] = useMedicationState([]);
  const [shots, setShots] = useShots([]);
  const [editMode, setEditMode] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [shotToEdit, setShotToEdit] = React.useState(null);
  const [medicViewMode, setMedicViewMode] = useMedicViewMode('list');

  const formRef = React.useRef();
  const timeRef = React.useRef();

  const deleteMedication = React.useCallback(
    deleteUuid => {
      setMedications(
        prevMedications => prevMedications.filter(({ uuid }) => uuid !== deleteUuid),
      );
    },
    [setMedications],
  );

  const deleteShot = React.useCallback(
    deleteUuid => {
      setShots(
        prevShots => prevShots.filter(({ uuid }) => uuid !== deleteUuid),
      );
    },
    [setShots],
  );

  const addMedication = React.useCallback(
    newOne => {
      setMedications(
        prevMedications => [
          ...prevMedications.filter(({ uuid }) => uuid !== newOne.uuid),
          newOne,
        ],
      );
    },
    [setMedications],
  );

  const clearMedication = React.useCallback(
    () => {
      setMedications([]);
    },
    [setMedications],
  );

  const handleFormSubmit = event => {
    event.preventDefault();
    const data = new FormData(event.target);
    const formEntries = Object.fromEntries(
      Array.from(data.entries()).filter(({ 1: value }) => value),
    );
    if (!formEntries.uuid) {
      formEntries.uuid = uuidv4();
    }
    const isValid = event.target.reportValidity();

    if (!isValid) {
      return;
    }

    addMedication(formEntries);
    event.target.reset();
    setEditMode(false);
    setShowModal(false);
  };

  const editMedication = editUuid => {
    setEditMode(true);
    setShowModal(true);
    const medication = medications.find(({ uuid }) => editUuid === uuid);
    Object.entries(medication).forEach(([field, value]) => {
      formRef.current.elements[field].value = value;
    });
  };

  const handleCancel = () => {
    setShowModal(false);
    setTimeout(
      () => {
        setEditMode(false);
        formRef.current.reset();
      },
      200,
    );
  };

  const take = medication => {
    setShots(prevTakings => [
      ...prevTakings,
      {
        ...medication,
        ts: Date.now(),
        uuid: uuidv4(),
      },
    ]);
  };

  const editShot = ({ uuid: newUuid, ...rest }) => {
    setShots(prevShots => [
      ...prevShots.filter(({ uuid }) => (uuid !== newUuid)),
      {
        ...rest,
        uuid: newUuid,
      },
    ]);
  };

  const handleMedicViewModeChange = (event, value) => setMedicViewMode(value);

  const exportAll = () => {
    console.log({
      medications,
      shots,
    });
  };

  return (
    <Container maxWidth="sm">
      <Dialog open={showModal} onClose={() => setShowModal(false)} keepMounted>
        <DialogTitle>
          {editMode ? 'Modifier' : 'Ajouter'} un médicament
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

            <input name="uuid" type="text" />

            <DialogActions>
              <Button variant="outlined" type="submit">
                {editMode ? 'Modifier' : 'Ajouter'}
              </Button>
              <Button variant="outlined" color="warning" onClick={handleCancel}>
                Annuler
              </Button>
            </DialogActions>
          </Stack>
        </DialogContent>
      </Dialog>

      <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 1 }}>

        <ToggleButtonGroup size="small">
          <ToggleButton
            value
            onClick={() => {
              formRef.current.reset();
              setShowModal(true);
            }}
          >
            <Add color="success" />
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup size="small">
          <ToggleButton
            value
            onClick={clearMedication}
          >
            <DeleteForever color="error" />
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup size="small">
          <ToggleButton
            value
            onClick={exportAll}
          >
            <GetApp />
          </ToggleButton>
          <ToggleButton
            value
            onClick={() => {}}
          >
            <FileUpload />
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          color="primary"
          size="small"
          onChange={handleMedicViewModeChange}
          value={medicViewMode}
          exclusive
        >
          <ToggleButton value="list">
            <ListIcon />
          </ToggleButton>

          <ToggleButton value="line">
            <MoreHoriz />
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {medicViewMode === 'list' && (
        <List>
          {medications
            .sort(({ primary: a }, { primary: b }) => a.localeCompare(b))
            .map(medication => {
              const { primary, secondary, uuid, color, delay } = medication;

              return (
                <React.Fragment key={uuid}>
                  <Divider />

                  <ListItem disablePadding>
                    <ListItemButton onClick={() => take(medication)}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: color,
                            width: 30,
                            height: 30,
                            fontSize: '0.85rem',
                          }}
                        >
                          {primary.substr(0, 3)}
                        </Avatar>
                      </ListItemAvatar>

                      <ListItemText primary={primary} secondary={secondary} />

                      <ListItemSecondaryAction>
                        {delay && (
                          <Tooltip
                            arrow
                            title={(
                              <Box sx={{ textAlign: 'center' }}>
                                <strong>{delay} heure{delay > 1 ? 's' : ''}</strong> au moins<br />
                                entre chaque prise
                              </Box>
                            )}
                          >
                            <Box component="span">
                              <IconButton disabled>
                                <AvTimer />
                              </IconButton>
                            </Box>
                          </Tooltip>
                        )}

                        <IconButton
                          onClick={event => { event.stopPropagation(); editMedication(uuid); }}
                          color="info"
                        >
                          <Edit />
                        </IconButton>

                        <IconButton
                          edge="end"
                          onClick={event => { event.stopPropagation(); deleteMedication(uuid); }}
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItemButton>

                  </ListItem>
                </React.Fragment>
              );
            })}
        </List>
      )}

      {medicViewMode === 'line' && (
        <Stack direction="row" gap={0.5} flexWrap="wrap" sx={{ mt: 1 }}>
          {medications.map(medication => {
            const { uuid, primary, color, secondary } = medication;

            return (
              <ColorButton
                key={uuid}
                color={color}
                variant="contained"
                onClick={() => take(medication)}
              >
                <Stack
                  sx={{ lineHeight: 1.2, minHeight: '2em' }}
                  justifyContent="center"
                >
                  {primary}

                  {secondary && (
                    <Box
                      sx={{
                        fontSize: '0.8em',
                        opacity: 0.75,
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {secondary}
                    </Box>
                  )}
                </Stack>
              </ColorButton>
            );
          })}
        </Stack>
      )}

      <List>
        <ListSubheader>
          Dernières prises&nbsp;:
        </ListSubheader>

        {!shots.length && (
          <ListItem>
            <ListItemText
              primary="Rien pour le moment"
              sx={{ textAlign: 'center' }}
            />
          </ListItem>
        )}

        {shots.sort(({ ts: a }, { ts: b }) => (a - b)).map(shot => {
          const { uuid, ts, primary, color, secondary } = shot;

          return (
            <ListItem key={uuid}>
              <ListItemAvatar color="secondary">
                <Avatar sx={{ bgcolor: color, width: 30, height: 30, fontSize: '0.85rem' }}>
                  {primary.substr(0, 3)}
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={(
                  <>
                    {(shotToEdit !== uuid) && (
                      <>
                        {primary}

                        <Tooltip title={dayjs(ts).format('LLLL')}>
                          <Box component="span" sx={{ fontStyle: 'italic', color: '#bbb', fontSize: '0.8em' }}>
                            {' '}({dayjs(ts).fromNow()})
                          </Box>
                        </Tooltip>
                      </>
                    )}
                    {(shotToEdit === uuid) && (
                      <Stack direction="row">
                        <CustomTextField
                          label="Heure"
                          type="time"
                          defaultValue={dayjs(ts).format('HH:mm')}
                          inputRef={timeRef}
                        />
                        <IconButton
                          variant="outlined"
                          onClick={() => {
                            const [h, m] = timeRef.current.value.split(':');
                            const newDayjs = dayjs(ts).hour(h).minute(m);
                            const newTs = newDayjs.isAfter(dayjs())
                              ? newDayjs.subtract(1, 'day').valueOf()
                              : newDayjs.valueOf();

                            editShot({ ...shot, ts: newTs });
                            setShotToEdit(null);
                          }}
                          color="success"
                        >
                          <Done />
                        </IconButton>
                        <IconButton
                          variant="outlined"
                          onClick={() => setShotToEdit(null)}
                          color="error"
                        >
                          <Clear />
                        </IconButton>
                      </Stack>
                    )}
                  </>
                )}
                secondary={secondary}
              />

              <ListItemSecondaryAction sx={{ cursor: 'default' }}>
                <IconButton onClick={() => setShotToEdit(uuid)}>
                  <Edit />
                </IconButton>
                <IconButton edge="end" onClick={() => deleteShot(uuid)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    </Container>
  );
};

export default Home;
