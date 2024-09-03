import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Stack,
} from '@mui/material';

import { v4 as uuidv4 } from 'uuid';

import ColorButton from './ColorButton';
import { createShot } from '../slices/shots';

const MedicButtons = props => {
  const dispatch = useDispatch();
  const medications = useSelector(state => Object.values(state.medications));

  return (
    <Stack
      direction="row"
      gap={0.5}
      flexWrap="wrap"
      sx={{ mt: 1 }}
      {...props}
    >
      {medications.map(medication => {
        const { uuid, primary, color, secondary } = medication;

        return (
          <ColorButton
            key={uuid}
            color={color}
            variant="contained"
            onClick={() => dispatch(createShot({
              ...medication,
              ts: Date.now(),
              uuid: uuidv4(),
            }))}
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
  );
};

export default MedicButtons;
