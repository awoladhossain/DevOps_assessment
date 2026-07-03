# DevOps Engineer Assessment Submission

This repository contains the completed DevOps Engineer Assessment for building a production-ready Kubernetes platform.

## Project Structure
```
frontend-backend/
├── backend/
│   ├── Dockerfile
│   ├── index.js
│   ├── package.json
│   └── .dockerignore
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── src/
│   └── .dockerignore
├── k8s/
│   ├── backend-configmap.yaml
│   ├── backend-deployment.yaml
│   ├── backend-secret-example.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   └── ingress.yaml
├── terraform/
│   ├── main.tf
│   ├── provider.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── README.md
│   └── modules/
│       ├── network/
│       ├── acr/
│       ├── aks/
│       └── database/
├── docs/
│   ├── troubleshooting.md
│   └── future-improvements.md
├── docker-compose.yml
├── .dockerignore
└── README.md
```

---

## Task 1: Docker and Docker Compose (Local Execution)

### Running Locally
To launch both frontend and backend services inside containers locally, run:
```bash
docker compose up -d --build
```

### Verification
Verify that the services are online and communicating:
- **Backend API**:
  ```bash
  curl http://localhost:8080/
  # Output: Application is running
  
  curl http://localhost:8080/health
  # Output: {"status":"ok"}
  ```
- **Frontend App**: Open [http://localhost/](http://localhost/) in your browser. The frontend React app will load and call the backend health endpoint `/api/health` through the Nginx reverse proxy.

---

## Tasks 2-7 Documentation
- **CI/CD Pipeline (Task 2)**: Located in [.github/workflows/deploy.yml](.github/workflows/deploy.yml). Automates installation, linting, building, and pushing Docker images to a registry, tag creation, and deployment triggers.
- **Kubernetes Manifests (Task 3)**: Located in the [k8s/](k8s/) folder. Features isolated deployments, health check probes, Resource limits/requests, and ConfigMap/Secret credentials integration.
- **Private Database Connectivity (Task 4)**: Documented in [terraform/README.md](terraform/README.md#architecture--private-database-connectivity-task-4) and [docs/troubleshooting.md](docs/troubleshooting.md).
- **Terraform IAC (Task 5)**: Module-based resource provisioning configuration inside [terraform/](terraform/). See [terraform/README.md](terraform/README.md) for execution and maintenance practices.
- **Troubleshooting (Task 6)**: Written down in [docs/troubleshooting.md](docs/troubleshooting.md).
- **Future Improvements (Task 7)**: Outlined in [docs/future-improvements.md](docs/future-improvements.md).
