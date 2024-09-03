import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  Stack,
  Tooltip,
} from '@mui/material';

import {
  Clear,
  Delete,
  Done,
  Edit,
} from '@mui/icons-material';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/fr';

import { set } from '../slices/ui';
import CustomTextField from './CustomTextField';
import { deleteShot, editShot } from '../slices/shots';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(updateLocale);
dayjs.locale('fr');

const ShotList = ({ shots = [], ...props }) => {
  const dispatch = useDispatch();
  const shotToEdit = useSelector(state => state.ui.shotToEdit);
  const timeRef = React.useRef();

  return (
    <List {...props}>
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
                <IconButton onClick={() => dispatch(set({ shotToEdit: uuid }))}>
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
                          dispatch(set({ shotToEdit: null }));
                        }}
                        color="success"
                      >
                        <Done />
                      </IconButton>
                      <IconButton
                        variant="outlined"
                        onClick={() => dispatch(set({ shotToEdit: null }))}
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
  );
};

export default ShotList;
