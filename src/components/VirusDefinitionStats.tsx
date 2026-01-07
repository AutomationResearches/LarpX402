import { Database, Clock, Shield, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function VirusDefinitionStats() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date(Date.now() - 1000 * 60 * 60 * 3)); // 3 hours ago
  
  const stats = {
    totalSignatures: 8_547_231,
    malwareSignatures: 4_231_892,
    phishingPatterns: 2_156_734,
    exploitSignatures: 1_458_605,
    version: '2026.01.07.v3',
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const handleUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setLastUpdate(new Date());
    }, 2000);
  };

  return (
    <div className="border border-border rounded-lg bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold">Virus Definition Database</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleUpdate}
          disabled={isUpdating}
          className="gap-2 h-7 text-xs"
        >
          <RefreshCw className={`w-3 h-3 ${isUpdating ? 'animate-spin' : ''}`} />
          {isUpdating ? 'Updating...' : 'Update'}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-secondary/50 rounded-md p-3">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Total Signatures</span>
          </div>
          <p className="text-lg font-semibold">{formatNumber(stats.totalSignatures)}</p>
        </div>
        <div className="bg-secondary/50 rounded-md p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Last Updated</span>
          </div>
          <p className="text-sm font-medium">{formatTimeAgo(lastUpdate)}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Malware Signatures</span>
          <span>{formatNumber(stats.malwareSignatures)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Phishing Patterns</span>
          <span>{formatNumber(stats.phishingPatterns)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Exploit Signatures</span>
          <span>{formatNumber(stats.exploitSignatures)}</span>
        </div>
        <div className="flex justify-between text-xs pt-2 border-t border-border">
          <span className="text-muted-foreground">Database Version</span>
          <span className="font-mono text-accent">{stats.version}</span>
        </div>
      </div>
    </div>
  );
}
