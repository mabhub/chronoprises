import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Tooltip,
} from '@mui/material';

import {
  AvTimer,
  Delete,
  Edit,
} from '@mui/icons-material';

import { v4 as uuidv4 } from 'uuid';

import { deleteMedic } from '../slices/medications';
import { createShot } from '../slices/shots';

const MedicList = ({
  onEdit,
  onDelete,
  ...props
}) => {
  const dispatch = useDispatch();
  const medications = useSelector(state => Object.values(state.medications));

  return (
    <List {...props}>
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
                      onClick={event => { event.stopPropagation(); onEdit(uuid); }}
                      color="info"
                    >
                      <Edit />
                    </IconButton>

                    <IconButton
                      edge="end"
                      onClick={event => {
                        event.stopPropagation();
                        dispatch(deleteMedic(uuid));
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </>
                )}
              >
                <ListItemButton
                  onClick={() => dispatch(createShot({
                    ...medication,
                    ts: Date.now(),
                    uuid: uuidv4(),
                  }))}
                >
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
  );
};

export default MedicList;
