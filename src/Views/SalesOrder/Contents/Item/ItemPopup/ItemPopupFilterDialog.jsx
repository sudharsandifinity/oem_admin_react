import { Button, Dialog, List, ListItemStandard } from '@ui5/webcomponents-react'
import React from 'react'

const ItemPopupFilterDialog = (props) => {
    const {setFilterDialogOpen,filterdialogOpen,itempopupData,handleDialogItemClick,fieldName}=props

    return (
    <Dialog
            headerText={"Select " + fieldName + "" }
            open={filterdialogOpen}
            // style={{ width: "100px" }}
            onAfterClose={() => setFilterDialogOpen(false)}
            footer={<Button onClick={() => setFilterDialogOpen(false)}>Close</Button>}
          >
            <List onItemClick={(e)=>handleDialogItemClick(e,fieldName)}>
              {itempopupData.map((item, idx) => 
                <ListItemStandard key={idx} value={item[fieldName]}>{item[fieldName]}</ListItemStandard>
              )}
            </List>
          </Dialog>
  )
}

export default ItemPopupFilterDialog
