import { useApp } from '@/lib/context';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function SettingsPage() {
  const { state, dispatch } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 600 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text)' }}>Settings</h1>

      <Card>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)', marginBottom: 16 }}>Company</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input
            label="Company Name"
            value={state.settings?.companyName || ''}
            onChange={e => dispatch({ type: 'UPDATE_SETTINGS', payload: { companyName: e.target.value } })}
            placeholder="Acme Corp"
          />
          <Input
            label="Company Website"
            value={state.settings?.companyWebsite || ''}
            onChange={e => dispatch({ type: 'UPDATE_SETTINGS', payload: { companyWebsite: e.target.value } })}
            placeholder="https://acme.com"
          />
        </div>
      </Card>

      <Card>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)', marginBottom: 16 }}>Your Profile</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input
            label="Display Name"
            value={state.currentUser.name}
            onChange={() => {}}
            placeholder="Your name"
            disabled
          />
          <Input
            label="Email"
            value={state.currentUser.email}
            onChange={() => {}}
            placeholder="your@email.com"
            disabled
          />
          <Input
            label="Role"
            value={state.currentUser.role}
            onChange={() => {}}
            disabled
          />
        </div>
      </Card>

      <Card>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)', marginBottom: 16 }}>Notifications</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--color-text)' }}>Email Notifications</div>
            <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>Receive email updates about candidates and interviews</div>
          </div>
          <Button
            variant={state.settings?.emailNotifications ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => dispatch({ type: 'UPDATE_SETTINGS', payload: { emailNotifications: !state.settings?.emailNotifications } })}
          >
            {state.settings?.emailNotifications ? 'Enabled' : 'Disabled'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
