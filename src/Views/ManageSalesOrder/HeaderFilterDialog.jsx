import { Button, Dialog, List, ListItemStandard, Input } from '@ui5/webcomponents-react'
import React, { useState } from 'react'

const HeaderFilterDialog = (props) => {
  const { filterdialogOpen, setFilterDialogOpen, handleDialogItemClick, fieldName, itempopupData } = props;

  // ✅ Local search state
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Dialog
      headerText={"Select " + fieldName}
      open={filterdialogOpen}
      onAfterClose={() => setFilterDialogOpen(false)}
      footer={
        <div style={{ paddingBottom: '2px', paddingTop: '6px' }}>
          <Button style={{ width: '100px', height: '40px' }} onClick={() => setFilterDialogOpen(false)}>
            Continue...
          </Button>
        </div>
      }
      style={{height:"50%"}}
    >
      {/* ✅ Search Input */}
      <Input
        placeholder="Search..."
        value={searchTerm}
        onInput={(e) => setSearchTerm(e.target.value)}
        style={{ margin: "0 0 0.5rem 0", width: "100%" }}
      />

      {/* ✅ List with search + unique filter */}
      <List onItemClick={(e) => handleDialogItemClick(e, fieldName)}>
        {itempopupData &&
          itempopupData
            .filter(
              (item, index, self) =>
                index === self.findIndex((t) => t[fieldName] === item[fieldName])
            )
            .filter((item) =>
              item[fieldName]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((item, idx) => (
              <ListItemStandard key={idx} value={item[fieldName]}>
                {item[fieldName]}
              </ListItemStandard>
            ))
        }
      </List>
    </Dialog>
  );
};

export default HeaderFilterDialog;
