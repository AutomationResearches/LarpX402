import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, FileText, Link, Globe, Clock, CheckCircle, AlertTriangle, ArrowLeft, Trash2 } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

interface ScanRecord {
  id: string;
  type: 'file' | 'url' | 'browser';
  target: string;
  timestamp: Date;
  threatsFound: number;
  threatsBlocked: number;
  status: 'clean' | 'protected' | 'warning';
}

// Mock scan history data
const mockHistory: ScanRecord[] = [
  {
    id: '1',
    type: 'file',
    target: 'document.pdf',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    threatsFound: 0,
    threatsBlocked: 0,
    status: 'clean',
  },
  {
    id: '2',
    type: 'url',
    target: 'https://suspicious-site.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    threatsFound: 2,
    threatsBlocked: 2,
    status: 'protected',
  },
  {
    id: '3',
    type: 'browser',
    target: 'Full Browser Scan',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    threatsFound: 5,
    threatsBlocked: 5,
    status: 'protected',
  },
  {
    id: '4',
    type: 'file',
    target: 'setup.exe',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    threatsFound: 1,
    threatsBlocked: 1,
    status: 'protected',
  },
  {
    id: '5',
    type: 'url',
    target: 'https://safe-website.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
    threatsFound: 0,
    threatsBlocked: 0,
    status: 'clean',
  },
];

export default function ScanHistory() {
  const [history, setHistory] = useState<ScanRecord[]>(mockHistory);

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'file': return <FileText className="w-4 h-4" />;
      case 'url': return <Link className="w-4 h-4" />;
      case 'browser': return <Globe className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'clean': return <CheckCircle className="w-4 h-4 text-accent" />;
      case 'protected': return <Shield className="w-4 h-4 text-accent" />;
      default: return <AlertTriangle className="w-4 h-4 text-destructive" />;
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const totalScans = history.length;
  const threatsBlocked = history.reduce((acc, scan) => acc + scan.threatsBlocked, 0);
  const cleanScans = history.filter(s => s.status === 'clean').length;

  return (
    <div className="min-h-screen bg-background grid-bg">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RouterLink to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img 
                src="/images/logo.jpg" 
                alt="LarpX402" 
                className="w-10 h-10 rounded-sm object-cover object-center"
              />
              <span className="text-lg font-semibold tracking-tight">LarpX402</span>
            </RouterLink>
          </div>
          
          <RouterLink to="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Scanner
            </Button>
          </RouterLink>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2">Scan History</h1>
          <p className="text-muted-foreground text-sm">View your previous security scans</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Scans</CardDescription>
              <CardTitle className="text-3xl">{totalScans}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Threats Blocked</CardDescription>
              <CardTitle className="text-3xl text-accent">{threatsBlocked}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Clean Scans</CardDescription>
              <CardTitle className="text-3xl">{cleanScans}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* History List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Scans</CardTitle>
              <CardDescription>Your scan activity</CardDescription>
            </div>
            {history.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearHistory} className="gap-2">
                <Trash2 className="w-4 h-4" />
                Clear History
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No scan history yet</p>
                <RouterLink to="/">
                  <Button variant="outline" className="mt-4">Start Scanning</Button>
                </RouterLink>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((scan) => (
                  <div 
                    key={scan.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        {getTypeIcon(scan.type)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{scan.target}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(scan.timestamp)}
                          <span className="capitalize">• {scan.type} scan</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {scan.threatsFound > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {scan.threatsBlocked}/{scan.threatsFound} blocked
                        </span>
                      )}
                      <div className="flex items-center gap-2">
                        {getStatusIcon(scan.status)}
                        <span className="text-sm capitalize">{scan.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
