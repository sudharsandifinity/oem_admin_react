import { Button, ComboBox, Dialog, List, ListItemStandard, MultiComboBoxItem, Option, Select } from '@ui5/webcomponents-react';
import ComboBoxItem from '@ui5/webcomponents/dist/ComboBoxItem.js';
import React from 'react'

const SyncBranchDialog = (props) => {
    const {open,setOpenSyncBranchDialog,companyList,handleSyncBranch} = props;
  return (
    <Dialog open={open} onClose={() => setOpenSyncBranchDialog(false)}
    headerText="Select Company to Sync Branches"
    style={{width:"400px",height:"600px"}}
    footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button onClick={() =>{ setOpenSyncBranchDialog(false);}}>Sync Branch</Button>
          <Button onClick={() => setOpenSyncBranchDialog(false)}>Cancel</Button>
        </div>
      }
    >   
        <div style={{ padding: '1rem' }}>
          <List onItemClick={(e) => handleSyncBranch(e)}>
        {companyList.map((item, idx) => (
              <ListItemStandard key={item.id} value={item.id}>
                {item.name}
              </ListItemStandard>
            ))
        }
      </List>
            
        </div>
    </Dialog>
  )
}

export default SyncBranchDialog