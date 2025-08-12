import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPassword } from '../../../store/slices/authSlice';


import { AnimatedUI5Button } from './AnimatedUI5Button';
import { BusyIndicator, Button, FlexBox, FormItem, Icon, Input, Label, MessageStrip } from '@ui5/webcomponents-react';

export default function ChangePassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token');

  const { resetStatus, resetMessage } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.newPassword != form.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    if (!token) {
      setFormError('Invalid or missing token');
      return;
    }

    dispatch(resetPassword({ token, newPassword: form.newPassword, confirmPassword: form.confirmPassword })).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        navigate('/login');
      }
    });
  };

  return (
    <>
      {formError && (
        <MessageStrip
          design="Negative"
          hideCloseButton={false}
          hideIcon={false}
          style={{ marginBottom: "1rem" }}
        >
          {formError}
        </MessageStrip>
      )}

      <form onSubmit={handleSubmit}>
        {/* New password */}
        <FormItem
          label={<Label required>New Password</Label>}
          style={{ marginBottom: "1rem" }}
        >
          <Input
            type={showPassword ? "Text" : "Password"}
            name="newPassword"
            value={form.newPassword}
            placeholder="Enter new password"
            showIcon
            icon={<Icon name={showPassword ? "hide" : "show"} />}
            onIconClick={() => setShowPassword((p) => !p)}
            onInput={(e) =>
              handleChange({ target: { name: "newPassword", value: e.target.value } })
            }
            required
          />
        </FormItem>

        {/* Confirm password */}
        <FormItem
          label={<Label required>Confirm Password</Label>}
          style={{ marginBottom: "1rem" }}
        >
          <Input
            type={showConfirmPassword ? "Text" : "Password"}
            name="confirmPassword"
            value={form.confirmPassword}
            placeholder="Re‑enter password"
            showIcon
            icon={<Icon name={showConfirmPassword ? "hide" : "show"} />}
            onIconClick={() => setShowConfirmPassword((p) => !p)}
            onInput={(e) =>
              handleChange({ target: { name: "confirmPassword", value: e.target.value } })
            }
            required
          />
        </FormItem>

        {/* Submit button */}
        <FlexBox style={{ marginTop: "1rem" }}>
          <Button
            design="Emphasized"
            type="Submit"
            disabled={resetStatus === "loading"}
            style={{ width: "100%" }}
          >
            {resetStatus === "loading" ? (
              <BusyIndicator active size="Small" />
            ) : (
              "Reset Password"
            )}
          </Button>
        </FlexBox>
      </form>
    </>
  );
}