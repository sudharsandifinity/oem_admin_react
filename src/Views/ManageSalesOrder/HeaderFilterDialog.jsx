import { Button, Dialog, List, ListItemStandard } from '@ui5/webcomponents-react'
import React, { useState } from 'react'

const HeaderFilterDialog = (props) => {
  const {filterdialogOpen,setFilterDialogOpen,handleDialogItemClick,fieldName,itempopupData}=props;
  return (
    <div>
       <Dialog
            headerText={"Select " + fieldName + "" }
            open={filterdialogOpen}
            // style={{ width: "100px" }}
            onAfterClose={() => setFilterDialogOpen(false)}
            footer={<Button onClick={() => setFilterDialogOpen(false)}>Close</Button>}
          >
            <List onItemClick={(e)=>handleDialogItemClick(e,fieldName)}>
              
             {itempopupData &&
  itempopupData
    .filter(
      (item, index, self) =>
        index === self.findIndex((t) => t[fieldName] === item[fieldName])
    )
    .map((item, idx) => (
      <ListItemStandard key={idx} value={item[fieldName]}>
        {item[fieldName]}
      </ListItemStandard>
    ))}
            </List>
          </Dialog>
    </div>
  )
}

export default HeaderFilterDialog
