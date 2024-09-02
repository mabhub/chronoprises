import React from 'react';
import {
  Avatar,
  Box,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Tooltip,
  ListSubheader,
  ToggleButtonGroup,
  ToggleButton,
  Menu,
  MenuItem,
  Button,
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
  MoreHoriz,
} from '@mui/icons-material';

import { useDropzone } from 'react-dropzone';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/fr';

import { v4 as uuidv4 } from 'uuid';

import { useDispatch, useSelector } from 'react-redux';
import createPersistedState from '../hooks/usePersistedState';
import CustomTextField from './CustomTextField';
import MedicModal from './MedicModal';
import ColorButton from './ColorButton';

import { downloadJSON, readFiles } from '../lib';
import { createMedic, deleteMedic, editMedic, initMedications } from '../slices/medications';
import { createShot, deleteShot, editShot, initShots } from '../slices/shots';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(updateLocale);
dayjs.locale('fr');

const useMedicViewMode = createPersistedState('medicViewMode');

const Home = () => {
  const dispatch = useDispatch();
  const medications = useSelector(state => Object.values(state.medications));
  const shots = useSelector(state => Object.values(state.shots));

  const [editMode, setEditMode] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [shotToEdit, setShotToEdit] = React.useState(null);
  const [medicViewMode, setMedicViewMode] = useMedicViewMode('list');
  const [formValues, setFormValues] = React.useState();
  const [toolbarMenuAnchor, setToolbarMenuAnchor] = React.useState(null);

  const { open: openUpload, isDragAccept, getRootProps, getInputProps } = useDropzone({
    noClick: true,
    accept: {
      'application/json': ['.json'],
    },
    onDrop: async (acceptedFiles = []) => {
      const files = await readFiles(acceptedFiles);
      const decoder = new TextDecoder('utf-8');
      const contents = files.map(({ content }) => JSON.parse(decoder.decode(content)));

      contents.forEach(data => {
        if (data.shots) {
          const cleanShots = data.shots.map(shot => ({ uuid: uuidv4(), ...shot }));
          dispatch(initShots(cleanShots));
        }

        if (data.medications) {
          const cleanMedications = data.medications.map(medic => ({ uuid: uuidv4(), ...medic }));
          dispatch(initMedications(cleanMedications));
        }
      });
    },
  });

  const timeRef = React.useRef();

  const deleteMedication = deleteUuid => dispatch(deleteMedic(deleteUuid));

  const handleFormSubmit = formEntries => {
    if (!formEntries.uuid) {
      dispatch(createMedic(formEntries));
    } else {
      dispatch(editMedic(formEntries));
    }

    setFormValues({});
    setEditMode(false);
    setShowModal(false);
  };

  const editMedication = editUuid => {
    const medication = medications.find(({ uuid }) => editUuid === uuid);
    setFormValues(medication);
    setEditMode(true);
    setShowModal(true);
  };

  const take = medication =>
    dispatch(createShot({
      ...medication,
      ts: Date.now(),
      uuid: uuidv4(),
    }));

  const exportAll = () => {
    downloadJSON({
      medications,
      shots,
    }, `${dayjs().format('YYYYMMDD-HHmm')}-chronoprises.json`);
  };

  return (
    <Container
      maxWidth="sm"
      {...getRootProps()}
      sx={{
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Upload field */}
      <input {...getInputProps()} />

      {/* Upload drop zone */}
      {isDragAccept && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(255 255 255 / 0.8)',
            border: '4px dashed silver',
            borderRadius: 5,
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box>
            Déposez votre fichier de configuration
          </Box>
        </Box>
      )}

      <MedicModal
        open={showModal}
        initialValues={formValues}
        onClose={() => {
          setFormValues({});
          setEditMode(false);
          setShowModal(false);
        }}
        onSubmit={handleFormSubmit}
        alt={editMode}
      />

      <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 1 }}>

        <ToggleButtonGroup size="small">
          <ToggleButton value onClick={exportAll}>
            <GetApp />
          </ToggleButton>

          <ToggleButton value onClick={openUpload}>
            <FileUpload />
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Stack direction="row" spacing={1} justifyContent="flex-start" sx={{ mt: 1 }}>
        <ToggleButtonGroup size="small">
          <ToggleButton
            value
            onClick={() => {
              setFormValues({});
              setShowModal(true);
            }}
          >
            <Add color="success" />
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup size="small">
          <ToggleButton value disabled sx={{ opacity: 0.2 }}>
            <DeleteForever color="error" />
          </ToggleButton>
        </ToggleButtonGroup>

        <Button
          size="small"
          color="info"
          sx={{ minWidth: 0, ml: 'auto !important' }}
          onClick={event => setToolbarMenuAnchor(event.target)}
        >
          <MoreHoriz />
        </Button>

        <Menu
          open={Boolean(toolbarMenuAnchor)}
          anchorEl={toolbarMenuAnchor}
          onClose={() => setToolbarMenuAnchor(null)}
          onClick={() => setToolbarMenuAnchor(null)}
        >
          <MenuItem
            selected={medicViewMode === 'list'}
            onClick={() => setMedicViewMode('list')}
          >
            Voir un liste
          </MenuItem>
          <MenuItem
            selected={medicViewMode === 'button'}
            onClick={() => setMedicViewMode('button')}
          >
            Voir des boutons
          </MenuItem>
        </Menu>
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

                  <ListItem
                    disablePadding
                    secondaryAction={(
                      <>
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
                      </>
                    )}
                  >
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
                    </ListItemButton>

                  </ListItem>
                </React.Fragment>
              );
            })}
        </List>
      )}
      {medicViewMode === 'button' && (
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

        {shots.sort(({ ts: a }, { ts: b }) => (b - a)).map(shot => {
          const { uuid, ts, primary, color, secondary } = shot;

          return (
            <ListItem
              key={uuid}
              secondaryAction={(
                <>
                  <IconButton onClick={() => setShotToEdit(uuid)}>
                    <Edit />
                  </IconButton>
                  <IconButton title={uuid} edge="end" onClick={() => dispatch(deleteShot(uuid))}>
                    <Delete />
                  </IconButton>
                </>
              )}
            >
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
                          label="Quand ?"
                          type="datetime-local"
                          defaultValue={dayjs(ts).format('YYYY-MM-DDTHH:mm')}
                          inputRef={timeRef}
                        />
                        <IconButton
                          variant="outlined"
                          onClick={() => {
                            const newDayjs = dayjs(timeRef.current.value);
                            const newTs = newDayjs.isAfter(dayjs())
                              ? newDayjs.subtract(1, 'day').valueOf()
                              : newDayjs.valueOf();

                            dispatch(editShot({ ...shot, ts: newTs }));
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
            </ListItem>
          );
        })}
      </List>
    </Container>
  );
};

export default Home;
