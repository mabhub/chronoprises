import React from 'react';

import {
  Box,
  Container,
} from '@mui/material';

import { useDropzone } from 'react-dropzone';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/fr';

import { v4 as uuidv4 } from 'uuid';

import { useDispatch, useSelector } from 'react-redux';
import MedicModal from './MedicModal';

import { readFiles } from '../lib';
import { createMedic, editMedic, initMedications } from '../slices/medications';
import { initShots } from '../slices/shots';
import { set } from '../slices/ui';

import ImportExport from './ImportExport';
import Toolbar from './Toolbar';
import MedicList from './MedicList';
import MedicButtons from './MedicButtons';
import ShotList from './ShotList';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(updateLocale);
dayjs.locale('fr');

const Home = () => {
  const dispatch = useDispatch();
  const medications = useSelector(state => Object.values(state.medications));
  const shots = useSelector(state => Object.values(state.shots));

  const editMode = useSelector(state => state.ui.editMode);
  const showModal = useSelector(state => state.ui.showModal);
  const medicViewMode = useSelector(state => state.ui.medicViewMode);

  const [formValues, setFormValues] = React.useState();

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

  const handleFormSubmit = formEntries => {
    if (!formEntries.uuid) {
      dispatch(createMedic(formEntries));
    } else {
      dispatch(editMedic(formEntries));
    }

    setFormValues({});
    dispatch(set({ editMode: false, showModal: false }));
  };

  const editMedication = editUuid => {
    const medication = medications.find(({ uuid }) => editUuid === uuid);
    setFormValues(medication);
    dispatch(set({ editMode: true, showModal: true }));
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
          dispatch(set({ editMode: false, showModal: false }));
        }}
        onSubmit={handleFormSubmit}
        alt={editMode}
      />

      <ImportExport onUpload={openUpload} />

      <Toolbar
        onAdd={() => {
          setFormValues({});
          dispatch(set({ showModal: true }));
        }}
      />

      {medicViewMode === 'list' && (
        <MedicList
          onEdit={uuid => editMedication(uuid)}
        />
      )}

      {medicViewMode === 'button' && (
        <MedicButtons />
      )}

      <ShotList shots={shots} />

      <StoreDebug />
    </Container>
  );
};

export default Home;
