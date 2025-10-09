import { Button, Dialog, List, ListItemStandard } from '@ui5/webcomponents-react'
import React from 'react'

const CustomerPopupFilterDialog = (props) => {
    const {setDialogOpen,dialogOpen,tableData,handleDialogItemClick,selectedFieldname}=props
console.log("customerTableValues",tableData,selectedFieldname)
    return (
    <Dialog
            headerText={"Select " + selectedFieldname + "" }
            open={dialogOpen}
            // style={{ width: "100px" }}
            onAfterClose={() => setDialogOpen(false)}
            footer={<Button onClick={() => setDialogOpen(false)}>Close</Button>}
          >
            <List onItemClick={(e)=>handleDialogItemClick(e,selectedFieldname)}>
              {tableData.map((item, idx) => 
                <ListItemStandard key={idx} value={item[selectedFieldname]}>{item[selectedFieldname]}</ListItemStandard>
              )}
            </List>
          </Dialog>
  )
}

export default CustomerPopupFilterDialog
