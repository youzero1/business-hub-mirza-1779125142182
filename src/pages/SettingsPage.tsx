import { useState } from 'react';
import { useApp } from '@/lib/context';
import { Settings, User, Bell, Palette, Globe } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

export default function SettingsPage() {
  const { state, dispatch } = useApp();
  const [name, setName] = useState(state.currentUser.name);
  const [email, setEmail] = useState(state.currentUser.email);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    dispatch({
      type: 'UPDATE_CURRENT_USER',
      payload: { name: name.trim() || state.currentUser.name, email: email.trim() || state.currentUser.email },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 640 }}>
      <Card padding="lg">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <User size={18} style={{ color: 'var(--color-primary)' }} />
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)' }}>Profile</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Display Name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
          <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Button onClick={handleSave}>Save Changes</Button>
            {saved && <span style={{ fontSize: 13, color: 'var(--color-success)' }}>✓ Saved</span>}
          </div>
        </div>
      </Card>

      <Card padding="lg">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Globe size={18} style={{ color: 'var(--color-primary)' }} />
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)' }}>Company</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Company Name" value={state.settings?.companyName || ''} onChange={() => {}} placeholder="Acme Corp" disabled />
          <p style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>Company settings are managed by your administrator.</p>
        </div>
      </Card>

      <Card padding="lg">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Bell size={18} style={{ color: 'var(--color-primary)' }} />
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)' }}>Notifications</h2>
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Notification preferences coming soon.</p>
      </Card>
    </div>
  );
}
