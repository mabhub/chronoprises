import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Add,
  DeleteForever,
  MoreHoriz,
} from '@mui/icons-material';

import {
  Button,
  Menu,
  MenuItem,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

import { set } from '../slices/ui';

const Toolbar = ({ onAdd }) => {
  const dispatch = useDispatch();
  const medicViewMode = useSelector(state => state.ui.medicViewMode);

  const [toolbarMenuAnchor, setToolbarMenuAnchor] = React.useState(null);

  return (
    <Stack direction="row" spacing={1} justifyContent="flex-start" sx={{ mt: 1 }}>
      <ToggleButtonGroup size="small">
        <ToggleButton
          value
          onClick={onAdd}
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
          onClick={() => dispatch(set({ medicViewMode: 'list' }))}
        >
          Voir un liste
        </MenuItem>
        <MenuItem
          selected={medicViewMode === 'button'}
          onClick={() => dispatch(set({ medicViewMode: 'button' }))}
        >
          Voir des boutons
        </MenuItem>
      </Menu>
    </Stack>
  );
};

export default Toolbar;
