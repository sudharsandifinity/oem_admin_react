import { Button, Menu, MenuItem, MenuSeparator } from "@ui5/webcomponents-react";
import React from "react";

const CustomerSelection = (props) => {
  const { menuRef} = props;
  return (
   <>

  <Menu ref={menuRef}>
                <MenuItem icon="add-document" text="Company Name1" />
                <MenuItem icon="add-document" text="Company Name2" />
                <MenuSeparator />
                <MenuItem  text="Company Name3">
                    <MenuItem text="Branch1" />
                    <MenuItem text="Branch2" />
                    <MenuItem text="Branch3" />
                </MenuItem>
                <MenuItem icon="add-document" text="Company Name4" />
                <MenuSeparator />
                <MenuItem icon="add-document" text="Company Name5" />
                <MenuItem icon="add-document" text="Company Name6" />
              </Menu>
</>
  );
};

export default CustomerSelection;
