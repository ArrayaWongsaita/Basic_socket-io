import { Button } from '@/shared/components/ui';
import ConnectStatus from '../components/ConnectStatus';

export default function LearnPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <ConnectStatus active={true} socketID={''} />

        <div className="flex flex-col gap-4">
          <Button variant="default" className="w-full" onClick={() => {}}>
            👋 Send Hello
          </Button>

          <Button variant="outline" className="w-full" onClick={() => {}}>
            🔌 Connect
          </Button>

          <Button variant="destructive" className="w-full" onClick={() => {}}>
            ❌ Disconnect
          </Button>
        </div>
      </div>
    </div>
  );
}
