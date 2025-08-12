import PropTypes from 'prop-types';
// material-ui

// project imports
import { Card, FlexBox } from '@ui5/webcomponents-react';

// ==============================|| AUTHENTICATION CARD WRAPPER ||============================== //

export default function AuthCardWrapper({ children, ...other }) {
  return (
     <Card
      style={{
        maxWidth: window.innerWidth < 600 ? '400px' : '475px',
        margin: window.innerWidth < 900 ? '20px' : '24px',
        padding: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
      {...other}
    >
      <FlexBox
        wrap="Wrap"
        style={{
          flexGrow: 1,
          flexBasis: '50%',
          width: '100%',
        }}
      >
        {children}
      </FlexBox>
    </Card>
  );
}

AuthCardWrapper.propTypes = { children: PropTypes.any, other: PropTypes.any };
