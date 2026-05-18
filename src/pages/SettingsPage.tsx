import { useApp } from '@/lib/context';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function SettingsPage() {
  const { state, dispatch } = useApp();
  const { settings } = state;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 600 }}>
      <Card>
        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--color-text)' }}>Company Settings</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="Company Name"
            value={settings?.companyName ?? ''}
            onChange={e => dispatch({ type: 'UPDATE_SETTINGS', payload: { companyName: e.target.value } })}
          />
          <Input
            label="Industry"
            value={settings?.industry ?? ''}
            onChange={e => dispatch({ type: 'UPDATE_SETTINGS', payload: { industry: e.target.value } })}
          />
          <Input
            label="Location"
            value={settings?.location ?? ''}
            onChange={e => dispatch({ type: 'UPDATE_SETTINGS', payload: { location: e.target.value } })}
          />
          <Button onClick={() => {}} variant="primary">Save Changes</Button>
        </div>
      </Card>

      <Card>
        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--color-text)' }}>User Preferences</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="Your Name"
            value={state.currentUser?.name ?? ''}
            onChange={() => {}}
            disabled
          />
          <Input
            label="Role"
            value={state.currentUser?.role ?? ''}
            onChange={() => {}}
            disabled
          />
          <Button onClick={() => {}} variant="secondary">Update Profile</Button>
        </div>
      </Card>
    </div>
  );
}
