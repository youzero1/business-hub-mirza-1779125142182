import { useApp } from '@/lib/context';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function SettingsPage() {
  const { state, dispatch } = useApp();
  const settings = state.settings;

  return (
    <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card>
        <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Company Settings</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input
            label="Company Name"
            value={settings?.companyName ?? ''}
            onChange={e => dispatch({ type: 'UPDATE_SETTINGS', payload: { companyName: e.target.value } })}
          />
          <Input
            label="Company Website"
            value={settings?.companyWebsite ?? ''}
            onChange={e => dispatch({ type: 'UPDATE_SETTINGS', payload: { companyWebsite: e.target.value } })}
          />
        </div>
      </Card>

      <Card>
        <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Notifications</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>Email Notifications</div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: 12, marginTop: 2 }}>Receive email alerts for new applications</div>
          </div>
          <Button
            variant={settings?.emailNotifications ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => dispatch({ type: 'UPDATE_SETTINGS', payload: { emailNotifications: !settings?.emailNotifications } })}
          >
            {settings?.emailNotifications ? 'Enabled' : 'Disabled'}
          </Button>
        </div>
      </Card>

      <Card>
        <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Candidate Portal</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 12 }}>
          Share this link with candidates to let them apply directly.
        </p>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <code style={{ background: 'var(--color-surface-2)', padding: '8px 12px', borderRadius: 'var(--radius-md)', fontSize: 12, flex: 1 }}>
            {window.location.origin}/portal
          </code>
          <Button variant="secondary" size="sm" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/portal`)}>
            Copy
          </Button>
        </div>
      </Card>
    </div>
  );
}
