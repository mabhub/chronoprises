import React from 'react';
import { useSelector } from 'react-redux';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/fr';

import {
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  FileUpload,
  GetApp,
} from '@mui/icons-material';

import { downloadJSON } from '../lib';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(updateLocale);
dayjs.locale('fr');

const ImportExport = ({
  onUpload,
}) => {
  const medications = useSelector(state => Object.values(state.medications));
  const shots = useSelector(state => Object.values(state.shots));

  const exportAll = () => {
    downloadJSON({
      medications,
      shots,
    }, `${dayjs().format('YYYYMMDD-HHmm')}-chronoprises.json`);
  };

  return (
    <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 1 }}>
      <ToggleButtonGroup size="small">
        <ToggleButton value onClick={exportAll}>
          <GetApp />
        </ToggleButton>

        <ToggleButton value onClick={onUpload}>
          <FileUpload />
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
};

export default React.memo(ImportExport);
