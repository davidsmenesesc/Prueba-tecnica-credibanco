# Credibanco DevSecOps - Prueba Técnica

## 📋 Descripción

Proyecto de ejemplo que implementa un pipeline completo de **DevSecOps** con:

- ✅ Aplicación Node.js con pruebas unitarias (cobertura >80%)
- ✅ Pipeline de GitHub Actions
- ✅ Docker containerización
- ✅ Helm charts para Kubernetes
- ✅ ArgoCD para GitOps

## 🚀 Estructura del Proyecto

```
.
├── src/                          # Código fuente
│   ├── app.js                   # Aplicación Express
│   └── app.test.js              # Tests
├── .github/workflows/            # GitHub Actions
│   └── trigger1.yml             # Pipeline principal
├── helm/credibanco-app/         # Helm chart
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/               # Manifiestos Kubernetes
├── kubernetes/                   # Manifiestos adicionales
│   └── argocd-app.yaml         # Aplicación ArgoCD
├── Dockerfile                    # Imagen Docker
└── README.md                     # Este archivo
```

## 📦 Requisitos

- Node.js 18+
- Docker
- kubectl
- Helm 3
- GitHub Actions (en el repositorio)
- ArgoCD (en el cluster Kubernetes)

## 🔧 Desarrollo Local

### Instalar dependencias
```bash
npm install
```

### Ejecutar tests
```bash
npm test
```

### Ejecutar aplicación
```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 🐳 Docker

### Construir imagen
```bash
docker build -t credibanco-app:latest .
```

### Ejecutar contenedor
```bash
docker run -p 3000:3000 credibanco-app:latest
```

## 🚢 Despliegue con Helm

### Instalar en Kubernetes
```bash
helm install credibanco ./helm/credibanco-app \
  -f helm/credibanco-app/values.yaml \
  -n credibanco --create-namespace
```

### Actualizar deployment
```bash
helm upgrade credibanco ./helm/credibanco-app \
  -f helm/credibanco-app/values.yaml \
  -n credibanco
```

## 🔄 GitOps con ArgoCD

### Crear aplicación ArgoCD
```bash
kubectl apply -f kubernetes/argocd-app.yaml
```

## 📊 Pipeline de CI/CD

El workflow de GitHub Actions ejecuta:

1. **Tests Unitarios**: Jest con cobertura >80%
2. **Análisis Estático**: ESLint
3. **Build**: Compilación de la aplicación
4. **Análisis Dinámico**: Pruebas de ejecución
5. **Build Docker**: Construye imagen
6. **Push Registry**: Sube a DockerHub/Quay.io
7. **Deploy**: Actualiza manifiestos para ArgoCD

## 🔐 Seguridad

- Imagen Docker multi-stage
- Usuario no-root en contenedor
- Health checks
- Análisis de cobertura mínimo 80%
- ESLint para código limpio

## 📈 Endpoints de la API

- `GET /` - Información de bienvenida
- `GET /health` - Status de salud
- `POST /api/validate` - Valida un valor
- `GET /api/sum/:a/:b` - Suma dos números

## 📝 Licencia

MIT
