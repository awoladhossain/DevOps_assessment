import axios from 'axios';
import { useEffect, useState } from 'react';

// Modern SVG Icons as functional components
const ServerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="22" height="22">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v3.75a3 3 0 0 1-3 3ZM12 7.5h.008v.008H12V7.5Zm.008 4.5h.008v.008H12.008V12ZM5.25 19.5h13.5a3 3 0 0 0 3-3V16.5a3 3 0 0 0-3-3H5.25a3 3 0 0 0-3 3v.75a3 3 0 0 0 3 3ZM12 16.5h.008v.008H12v-.008Zm.008 1.5h.008v.008H12.008V18Z" />
  </svg>
);

const CpuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="22" height="22">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m10.5-5.25v1.5M3 12h1.5m10.5 5.25V18.75M3 15.75h1.5m15-7.5H19.5m0 3.75H21m-1.5 3.75H21M8.25 19.5V21m5.25-1.5V21m-6.75-16.5h7.5A2.25 2.25 0 0 1 16.5 6.75v7.5A2.25 2.25 0 0 1 14.25 16.5h-7.5A2.25 2.25 0 0 1 4.5 14.25v-7.5A2.25 2.25 0 0 1 6.75 4.5Z" />
  </svg>
);

const PipelineIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="22" height="22">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.64 8.38m5.95 5.99a5.96 5.96 0 0 1-5.84 1.38m0 0a15.68 15.68 0 0 1-6.16-12.12A15.68 15.68 0 0 1 9.64 8.38m0 0a5.96 5.96 0 0 1 5.95 0V3.6" />
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="16" height="16">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

const App = () => {
  const [status, setStatus] = useState('LOADING');
  const [latency, setLatency] = useState(null);
  const [backendData, setBackendData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { timestamp, message, type }]);
  };

  const checkHealth = async () => {
    setIsLoading(true);
    setStatus('LOADING');
    addLog('Initiating health check query to /api/health...', 'info');
    const startTime = performance.now();

    try {
      const response = await axios.get('/api/health');
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      setStatus('ONLINE');
      setLatency(duration);
      setBackendData(response.data);
      addLog(`Health check successful. Status: ${response.data.status || 'ok'}. RTT: ${duration}ms`, 'success');
    } catch (error) {
      console.error('Error fetching backend health:', error);
      setStatus('FAILED');
      setLatency(null);
      setBackendData(null);
      addLog(`Health check failed: ${error.message}. Verify network proxy paths and backend service state.`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo-section">
          <div className="logo-icon">LM</div>
          <div className="logo-text">
            <h1>Logic Matrix</h1>
            <p>Production Kubernetes Platform</p>
          </div>
        </div>
        <div className="system-status-indicator">
          <span className={`status-dot ${status.toLowerCase()}`}></span>
          <span className="status-text">{status === 'ONLINE' ? 'SYSTEMS ONLINE' : status === 'LOADING' ? 'VERIFYING...' : 'DEGRADED STATE'}</span>
        </div>
      </header>

      {/* Grid Content */}
      <main className="dashboard-grid">
        {/* Card 1: Health Monitor */}
        <section className="card col-large">
          <h2 className="card-title">
            <ServerIcon /> Backend API Health Monitor
          </h2>
          <div className="card-content">
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Real-time response diagnostics of the Node.js API server deployed in the Kubernetes environment.
            </p>
            
            <div className="health-metrics">
              <div className="metric-box">
                <span className="metric-label">API Status</span>
                <span className={`metric-value ${status === 'ONLINE' ? 'success' : status === 'FAILED' ? 'error' : ''}`}>
                  {status}
                </span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Latency (RTT)</span>
                <span className="metric-value">
                  {latency !== null ? `${latency} ms` : 'N/A'}
                </span>
              </div>
            </div>

            <button 
              className="btn-trigger" 
              onClick={checkHealth} 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Checking API State...
                </>
              ) : (
                <>
                  <RefreshIcon />
                  Trigger Manual Diagnostic Check
                </>
              )}
            </button>

            <div>
              <span className="metric-label" style={{ display: 'block', marginBottom: '8px' }}>Diagnostic Output Console</span>
              <div className="terminal-console">
                <div className="log-container">
                  {logs.map((log, idx) => (
                    <div key={idx} className={`terminal-line ${log.type === 'success' || log.type === 'error' ? 'output' : ''}`} style={{ color: log.type === 'error' ? 'var(--color-error)' : log.type === 'success' ? 'var(--color-success)' : undefined }}>
                      [{log.timestamp}] {log.message}
                    </div>
                  ))}
                  {backendData && (
                    <div className="terminal-line output" style={{ marginTop: '4px', color: '#60a5fa' }}>
                      &gt; Payload: {JSON.stringify(backendData, null, 2)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Card 2: Environment Info */}
        <section className="card col-small">
          <h2 className="card-title">
            <CpuIcon /> Platform Configuration
          </h2>
          <div className="card-content">
            <div className="stats-list">
              <div className="stats-item">
                <span className="stats-name">Target Cloud</span>
                <span className="stats-val" style={{ color: '#38bdf8' }}>AWS</span>
              </div>
              <div className="stats-item">
                <span className="stats-name">Kubernetes Cluster</span>
                <span className="stats-val">EKS v1.29</span>
              </div>
              <div className="stats-item">
                <span className="stats-name">Cluster Name</span>
                <span className="stats-val">logicmatrix-eks-prod</span>
              </div>
              <div className="stats-item">
                <span className="stats-name">AWS Region</span>
                <span className="stats-val">us-east-1</span>
              </div>
              <div className="stats-item">
                <span className="stats-name">Frontend Service</span>
                <span className="stats-val">Port 80 (HTTP)</span>
              </div>
              <div className="stats-item">
                <span className="stats-name">Backend Service</span>
                <span className="stats-val">Port 8080 (TCP)</span>
              </div>
              <div className="stats-item">
                <span className="stats-name">Database Connectivity</span>
                <span className="stats-val" style={{ color: '#10b981' }}>Private Link VPC</span>
              </div>
            </div>
          </div>
        </section>

        {/* Card 3: CI/CD Pipeline Steps */}
        <section className="card col-medium">
          <h2 className="card-title">
            <PipelineIcon /> GitHub Actions Deployment Steps
          </h2>
          <div className="card-content">
            <div className="pipeline-steps">
              <div className="pipeline-step">
                <div className="step-icon success">✓</div>
                <div className="step-details">
                  <div className="step-name">Checkout & Setup</div>
                  <div className="step-desc">Pull source code & initialize node cache</div>
                </div>
                <span className="step-badge success">Passed</span>
              </div>
              <div className="pipeline-step">
                <div className="step-icon success">✓</div>
                <div className="step-details">
                  <div className="step-name">Install & Lint</div>
                  <div className="step-desc">Install dependencies and validate frontend linting</div>
                </div>
                <span className="step-badge success">Passed</span>
              </div>
              <div className="pipeline-step">
                <div className="step-icon success">✓</div>
                <div className="step-details">
                  <div className="step-name">Build & Tag Images</div>
                  <div className="step-desc">Build frontend/backend multi-stage images</div>
                </div>
                <span className="step-badge success">Passed</span>
              </div>
              <div className="pipeline-step">
                <div className="step-icon success">✓</div>
                <div className="step-details">
                  <div className="step-name">Push ECR Registry</div>
                  <div className="step-desc">Push tagged release image to AWS Elastic Container Registry</div>
                </div>
                <span className="step-badge success">Passed</span>
              </div>
            </div>
          </div>
        </section>

        {/* Card 4: CD Releases */}
        <section className="card col-medium">
          <h2 className="card-title">
            <PipelineIcon /> Continuous Delivery Status
          </h2>
          <div className="card-content">
            <div className="pipeline-steps">
              <div className="pipeline-step">
                <div className="step-icon success">✓</div>
                <div className="step-details">
                  <div className="step-name">Generate Release Tag</div>
                  <div className="step-desc">Automated SemVer release and release notes</div>
                </div>
                <span className="step-badge success">Active</span>
              </div>
              <div className="pipeline-step">
                <div className="step-icon success">✓</div>
                <div className="step-details">
                  <div className="step-name">AWS OIDC Authentication</div>
                  <div className="step-desc">Secure IAM Role assumption via OpenID Connect</div>
                </div>
                <span className="step-badge success">Connected</span>
              </div>
              <div className="pipeline-step">
                <div className="step-icon success">✓</div>
                <div className="step-details">
                  <div className="step-name">Deploy manifests to EKS</div>
                  <div className="step-desc">Apply deployments, service, Ingress configurations</div>
                </div>
                <span className="step-badge success">Successful</span>
              </div>
              <div className="pipeline-step">
                <div className="step-icon success">✓</div>
                <div className="step-details">
                  <div className="step-name">Kubectl Rollout Status Verification</div>
                  <div className="step-desc">Verifying status check of rolling deployments</div>
                </div>
                <span className="step-badge success">Synced</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Logic Matrix DevOps Platform Assessment Submission. Built with React + Express + EKS.</p>
      </footer>
    </div>
  );
};

export default App;
