# DevOps Assessment: Troubleshooting Runbook

This document answers the assessment troubleshooting questions.

---

### 1. Pod is in `CrashLoopBackOff`. What do you check?
- **Application Logs**: Run `kubectl logs <pod-name> --previous` to see why the application crashed during startup (e.g., database connection failure, syntax/type error, unhandled exception).
- **Describe Pod**: Run `kubectl describe pod <pod-name>` to inspect lifecycle events, failed probes, exit codes, and OOMKilled errors.
- **Environment & Secrets**: Verify that required ConfigMaps and Secrets are present and correctly mapped.

---

### 2. Deployment is successful, but app is not reachable. What do you check?
- **Service & Selectors**: Ensure the Service's `selector` labels match the Pod's labels.
- **Ports configuration**: Verify the Service's `targetPort` matches the container's listening port.
- **Ingress/LoadBalancer status**: Check the external IP of the Ingress controller or LoadBalancer service (`kubectl get ingress/svc`).
- **NetworkPolicies**: Check if any NetworkPolicy restricts access to the pods.

---

### 3. Difference between readiness and liveness probe?
- **Liveness Probe**: Determines if a container is running. If it fails, Kubernetes kills the container and restarts it.
- **Readiness Probe**: Determines if a container is ready to accept traffic. If it fails, the container is removed from the Service endpoints (no traffic is sent to it), but it is not restarted.

---

### 4. Docker build works locally but fails in pipeline. Why?
- **Architecture Difference**: Local machine runs ARM (Apple Silicon) while the pipeline agent runs AMD64 (x86_64).
- **Context/Cache**: Missing files or paths ignored in `.dockerignore` but locally present in the workspace.
- **Credential/Registry limits**: Rate limits on public Docker Hub pulls in pipeline agents.
- **Tool Versions**: Different Docker daemon/Buildx version on pipeline runner.

---

### 5. Pipeline fails during Docker build. What do you check?
- **Console Logs**: Identify the exact command/layer that failed (e.g., `npm install` timeout, compiler/lint errors, missing files).
- **Runner Disk Space**: Verify if the pipeline runner ran out of disk space during build.
- **Proxy/Network issues**: Check if packages (npm/apk/apt) failed to fetch due to internet connectivity or registry downtime.

---

### 6. Certificate renewal failed. What do you check?
- **DNS validation**: Ensure the DNS records still point to your Ingress controller / LoadBalancer IP.
- **HTTP validation path**: Check if Let's Encrypt can access `/.well-known/acme-challenge/` (verify Ingress rules).
- **Cert-manager logs**: Run `kubectl logs -n cert-manager deploy/cert-manager` and inspect `CertificateRequest` or `Order` resources for error details.

---

### 7. Ingress returns 502 or 504. What do you check?
- **502 Bad Gateway**:
  - Check if backend pods are healthy and running.
  - Check if the target Service port matches the Pod port.
- **504 Gateway Timeout**:
  - Backend took too long to respond. Check application logs for slow queries or lockups.
  - Check network path latency/connectivity between Ingress controller and Pods.

---

### 8. Vendor SFTP connection to port 22 times out. What do you check?
- **Outbound Firewall/Security Group**: Check if port 22 egress is blocked by your subnet's Security Group, NAT Gateway, or AWS Network Firewall.
- **Whitelisting**: Check if the vendor requires your public egress IP to be whitelisted on their end.
- **DNS/Route**: Verify that the vendor host resolves to the correct IP and routing table has a path to the internet.

---

### 9. Terraform plan wants to recreate the cluster. What do you check?
- Check the **trigger attributes** in `terraform plan` output marked with `forces new resource`.
- Check if mutable values were modified in manual console operations causing state drift.
- Verify if any variables (like resource group name, subnet id, or DNS prefix) were changed in the configuration.

---

### 10. How would you upgrade AKS/EKS safely?
- **Upgrade order**: Control plane first, then worker node groups/pools, then cluster add-ons/CNI.
- **Blue/Green Node Pools**: Create a new node pool with the target K8s version, taint the old node pool, drain it slowly, and delete it once all workloads migrate.
- **Surge Upgrades**: Configure rolling upgrades (`maxSurge` set to at least 1 or 2) so new nodes spawn before old ones terminate.

---

### 11. Frontend loads, but backend API calls fail. What do you check?
- **Browser Developer Tools**: Inspect failing API requests in the network tab (look for 502/404/504 errors).
- **Nginx Ingress/Proxy logs**: Check frontend container logs to see if Nginx proxying is failing to reach the backend service.
- **Backend Service DNS**: Verify the frontend can resolve the backend hostname (`http://backend:8080/`) inside the cluster.

---

### 12. Backend pod is running, but database connection times out. What do you check?
- **Security Groups**: Ensure the DB Security Group allows ingress from the EKS nodes Security Group on port `5432`.
- **Private Link / Endpoint status**: Ensure the private endpoint is approved and online.
- **Route tables**: Verify route tables exist between AKS and DB subnets.

---

### 13. Private DNS is not resolving database hostname. What do you check?
- **VPC DNS Attributes**: Ensure `enableDnsHostnames` and `enableDnsSupport` are set to `true` on the VPC.
- **Kube-DNS / CoreDNS status**: Check if CoreDNS pods in `kube-system` are healthy and logs do not show resolution timeouts.
- **DNS integration**: Verify if Azure private DNS resolver is configured if using custom DNS servers.

---

### 14. How would you rotate database credentials safely?
1. Update database server with a new secondary password (keeping the primary active).
2. Update Kubernetes Secret with the new secondary password.
3. Perform a rolling restart of backend pods to use the new password.
4. Verify backend is running healthily.
5. Remove the old primary password from the database.

---

### 15. Secrets were accidentally committed to GitHub. What do you do?
1. **Revoke and Rotate**: Immediately rotate the committed secret (keys, passwords, tokens) on the respective cloud/database provider.
2. **Purge Git History**: Use tools like `git-filter-repo` or `BFG Repo-Cleaner` to purge the secret from all branches, tags, and commit history.
3. **Force Push**: Push the cleaned history to GitHub (`git push origin --force --all`).
4. **Audit**: Review GitHub repository access logs and audit trails to determine if the secret was accessed by external actors.
