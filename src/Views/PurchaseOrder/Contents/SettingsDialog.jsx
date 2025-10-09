import { Button, Dialog, List, ListItemStandard } from '@ui5/webcomponents-react'
import React from 'react'

const SettingsDialog = (props) => {
    const {setSettingsDialogOpen,settingsDialogOpen,handleSettingsListClick,dynamicColumnslist}=props;
  return (
     <Dialog
            headerText="Select Column Name"
            open={settingsDialogOpen}
            // style={{ width: "100px" }}
            onAfterClose={() => setSettingsDialogOpen(false)}
            footer={<Button onClick={() => setSettingsDialogOpen(false)}>Close</Button>}
          >
            <List onSelectionChange={handleSettingsListClick} selectionMode="Multiple">
              {dynamicColumnslist.map((item, idx) => (
                <ListItemStandard key={idx}>{item.accessor}</ListItemStandard>
              ))}
            </List>
          </Dialog>
  )
}

export default SettingsDialog
