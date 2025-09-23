import { BusyIndicator, Card, FlexBox, List, ListItemStandard, MessageStrip, Text } from '@ui5/webcomponents-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchFormById } from '../../../../store/slices/formmasterSlice';
import { useNavigate } from 'react-router-dom';

const ViewFormMaster = (props) => {
   const { id } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const { forms } = useSelector((state) => state.forms);
  const form = forms.find((c) => c.id === id);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!form&&id) {
          const res= await dispatch(fetchFormById(id)).unwrap();
          if (res.message === "Please Login!") {
          navigate("/login");
        }
        }
      } catch (err) {
        setApiError("Failed to fetch form");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, id, form]);

  if (loading) {
    return (
      <FlexBox
        justifyContent="Center"
        alignItems="Center"
        direction="Column"
        style={{ marginTop: "2rem" }}
      >
        <BusyIndicator active size="Medium" />
      </FlexBox>
    );
  }

  if (!form) {
    return (
      <FlexBox style={{ marginTop: "2rem" }}>
        <MessageStrip
          design="Negative"
          hideCloseButton={false}
          hideIcon={false}
        >
          User not found
        </MessageStrip>
      </FlexBox>
    );
  }
  return (
    <Card style={{ margin: "2rem" ,padding:"2rem"}}>
      
<List>
        <ListItemStandard ><Text>
          <strong>Form Name:</strong> {form.name}
        </Text></ListItemStandard>
        <ListItemStandard ><Text>
          <strong>Display Name:</strong> {form.display_name}
        </Text></ListItemStandard>
      
        
       <ListItemStandard ><Text>
          <strong>Status:</strong>{" "}
          {form.status === "1" || form.status === 1 ? "Active" : "Inactive"}
        </Text></ListItemStandard>
    
      </List>
    </Card>
  )
}

export default ViewFormMaster
