# Arquitectura de la Solución DevSecOps

## 🏗️ Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                     GitHub Repository                             │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │         .github/workflows/trigger1.yml                     │   │
│  │  ┌─────────────────────────────────────────────────────┐  │   │
│  │  │  Trigger: Push a main / PR con aprobación            │  │   │
│  │  └─────────────────────────────────────────────────────┘  │   │
│  └───────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │ GitHub Actions  │
                    │  (CI Pipeline)  │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼─────┐      ┌──────▼──────┐   ┌──────▼──────┐
    │Unit Tests│      │Static Code  │   │Build &      │
    │(Jest)    │      │Analysis     │   │Artifacts    │
    │Coverage  │      │(ESLint)     │   │             │
    │>80%      │      │             │   │             │
    └────┬─────┘      └──────┬──────┘   └──────┬──────┘
         │                   │                 │
         └───────────────────┼─────────────────┘
                             │
                    ┌────────▼────────────┐
                    │ Dynamic Analysis &  │
                    │ Composition Tests   │
                    └────────┬────────────┘
                             │
                    ┌────────▼────────────┐
                    │  Docker Build       │
                    │ (Multi-stage Build) │
                    └────────┬────────────┘
                             │
                    ┌────────▼────────────┐
                    │Push to Registry     │
                    │(DockerHub/Quay)     │
                    │image:SHA            │
                    └────────┬────────────┘
                             │
         ┌───────────────────▼──────────────────┐
         │  Update values.yaml con SHA          │
         │  Push a GitHub (triggering ArgoCD)   │
         └───────────────────┬──────────────────┘
                             │
    ┌────────────────────────▼─────────────────────────┐
    │           Kubernetes Cluster                      │
    │  ┌────────────────────────────────────────────┐  │
    │  │         ArgoCD (GitOps)                    │  │
    │  │  Watches: helm/credibanco-app/values.yaml  │  │
    │  │  Auto-sync: true, Prune: true              │  │
    │  └────────────────┬─────────────────────────┘  │
    │                  │                              │
    │  ┌───────────────▼──────────────────────────┐  │
    │  │    Helm Deployment                      │  │
    │  │  Namespace: credibanco                   │  │
    │  │  ┌──────────────────────────────────┐   │  │
    │  │  │ Pods (Replicas: 3)               │   │  │
    │  │  │ ┌────────────────────────────┐   │   │  │
    │  │  │ │ credibanco-app Container   │   │   │  │
    │  │  │ │ - Security: non-root user  │   │   │  │
    │  │  │ │ - Probes: liveness/ready   │   │   │  │
    │  │  │ │ - Resources limited        │   │   │  │
    │  │  │ └────────────────────────────┘   │   │  │
    │  │  └──────────────────────────────────┘   │  │
    │  │                                          │  │
    │  │ Service: ClusterIP (Port 80->3000)      │  │
    │  │ HPA: 2-10 replicas (CPU/Memory 80%)    │  │
    │  └──────────────────────────────────────────┘  │
    └────────────────────────────────────────────────┘
```

## 📊 Flujo de CI/CD Detallado

### Etapa 1: Testing & Validación
```
├── Unit Tests (Jest)
│   └── Coverage > 80% ✓
├── Static Analysis (ESLint)
│   └── Code Quality ✓
└── Build Application
    └── Artifacts generated ✓
```

### Etapa 2: Docker & Registry
```
├── Build Docker Image
│   ├── Multi-stage build
│   ├── Non-root user
│   └── Health checks ✓
└── Push to Registry
    ├── Tag: commit SHA
    └── Registry: DockerHub/Quay ✓
```

### Etapa 3: GitOps & Deployment
```
├── Update Git Repository
│   ├── values.yaml → new image SHA
│   └── Commit & Push ✓
├── ArgoCD Detection
│   ├── Watches for changes
│   └── Auto-sync enabled ✓
└── Kubernetes Deployment
    ├── Helm Chart applied
    ├── 3 replicas running
    ├── HPA configured
    └── Service exposed ✓
```

## 🔒 Componentes de Seguridad

### En Container
- Non-root user (UID 1001)
- Read-only filesystem (configurables)
- Resource limits (CPU/Memory)
- Health checks para recuperación automática

### En Kubernetes
- SecurityContext aplicado
- RBAC con ServiceAccount
- Network Policies (configurable)
- Resource Requests & Limits

### En CI/CD
- Análisis estático de código (ESLint)
- Tests obligatorios con cobertura
- Firma de commits (configurable)
- Registry authentication

## 📈 Escalabilidad

- **HPA**: Escala de 2 a 10 replicas
- **Triggers**: CPU > 80% o Memory > 80%
- **Probes**: Liveness & Readiness para health checks
- **Load Balancer**: Service ClusterIP

## 🔄 Sincronización con ArgoCD

| Característica | Valor |
|---|---|
| Automated Sync | true |
| Self-Heal | true |
| Prune | true |
| Retry Limit | 5 intentos |
| Backoff | 5s + exponencial |

## 📁 Estructura de Archivos

```
credibanco-app/
├── .github/
│   └── workflows/
│       └── trigger1.yml           # Pipeline principal
├── src/
│   ├── app.js                     # App Express
│   └── app.test.js                # Tests
├── helm/
│   └── credibanco-app/
│       ├── Chart.yaml             # Definición del chart
│       ├── values.yaml            # Valores por defecto
│       └── templates/
│           ├── deployment.yaml    # Deployment Kubernetes
│           ├── service.yaml       # Service
│           ├── serviceaccount.yaml # RBAC
│           ├── hpa.yaml           # Auto-scaling
│           └── _helpers.tpl       # Funciones Helm
├── kubernetes/
│   └── argocd-app.yaml           # Aplicación ArgoCD
├── Dockerfile                     # Imagen Docker
├── jest.config.js                 # Configuración tests
├── package.json                   # Dependencias Node.js
└── README.md                      # Documentación
```

## 🚀 Comandos de Uso

### Development
```bash
npm install
npm test
npm start
```

### Docker
```bash
docker build -t credibanco-app:latest .
docker run -p 3000:3000 credibanco-app:latest
```

### Kubernetes/Helm
```bash
helm install credibanco ./helm/credibanco-app -n credibanco --create-namespace
helm upgrade credibanco ./helm/credibanco-app -n credibanco
```

### ArgoCD
```bash
kubectl apply -f kubernetes/argocd-app.yaml
argocd app sync credibanco-app
```
