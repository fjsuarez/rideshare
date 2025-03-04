// src/components/ListCard.tsx
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const ListPanel: React.FC = () => {
  const items = ['Item 1', 'Item 2', 'Item 3'];

  return (
    <Card>
      <CardContent>
        <List>
          {items.map((item, index) => (
            <ListItem key={index}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ListPanel;