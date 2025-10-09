import { Button, Dialog, List, ListItemStandard } from '@ui5/webcomponents-react'
import React from 'react'

const ServicePopupFilterDialog = (props) => {
    const {setFilterDialogOpen,filterdialogOpen,servicepopupData,handleDialogServiceClick,fieldName}=props

    return (
    <Dialog
            headerText={"Select " + fieldName + "" }
            open={filterdialogOpen}
            // style={{ width: "100px" }}
            onAfterClose={() => setFilterDialogOpen(false)}
            footer={<Button onClick={() => setFilterDialogOpen(false)}>Close</Button>}
          >
            <List onItemClick={(e)=>handleDialogServiceClick(e,fieldName)}>
              {servicepopupData.map((service, idx) => 
                <ListItemStandard key={idx} value={service[fieldName]}>{service[fieldName]}</ListItemStandard>
              )}
            </List>
          </Dialog>
  )
}
export default ServicePopupFilterDialog
