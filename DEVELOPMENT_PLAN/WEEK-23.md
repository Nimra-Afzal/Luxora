# Week 23: Deployment Setup

> **Phase:** Polish & Launch (Week 23 of 24)
> **Focus:** Set up production infrastructure and CI/CD

---

## Week 23 Summary

Configure production deployment on Vercel (frontend), AWS (backend), and set up CI/CD pipelines.

---

## Day 1 (Monday): Frontend Deployment - Vercel

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 1.1 | Create Vercel account and project | SETUP | Vercel Dashboard |
| 1.2 | Connect GitHub repository to Vercel | SETUP | Vercel Dashboard |
| 1.3 | Configure environment variables in Vercel | SETUP | Vercel Dashboard |
| 1.4 | Set `NEXT_PUBLIC_API_URL` to production backend URL | SETUP | Vercel Dashboard |
| 1.5 | Set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | SETUP | Vercel Dashboard |
| 1.6 | Configure custom domain (if available) | SETUP | Vercel Dashboard |
| 1.7 | Deploy and verify frontend works | TEST | - |

---

## Day 2 (Tuesday): Backend Deployment - AWS Setup

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 2.1 | Create AWS account (if not exists) | SETUP | AWS Console |
| 2.2 | Set up IAM user for deployments with appropriate permissions | SETUP | AWS IAM |
| 2.3 | Create ECR repository for Docker images | SETUP | AWS ECR |
| 2.4 | Create ECS cluster (or EC2 instance for simpler setup) | SETUP | AWS ECS/EC2 |
| 2.5 | Create Application Load Balancer | SETUP | AWS ALB |
| 2.6 | Configure SSL certificate via AWS Certificate Manager | SETUP | AWS ACM |
| 2.7 | Set up security groups for backend | SETUP | AWS VPC |

---

## Day 3 (Wednesday): Backend Deployment - Docker & Deploy

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 3.1 | Verify Dockerfile is production-ready | VERIFY | `backend/Dockerfile` |
| 3.2 | Build and push Docker image to ECR | DEPLOY | - |
| 3.3 | Create ECS task definition (or EC2 deployment script) | ADD | AWS ECS |
| 3.4 | Configure environment variables in ECS/EC2 | SETUP | AWS |
| 3.5 | Set up MongoDB Atlas production cluster | SETUP | MongoDB Atlas |
| 3.6 | Set up Redis Cloud production instance | SETUP | Redis Cloud |
| 3.7 | Deploy backend and verify API works | TEST | - |

---

## Day 4 (Thursday): CI/CD Pipeline

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 4.1 | Create GitHub Actions workflow for frontend | ADD | `.github/workflows/frontend.yml` |
| 4.2 | Add steps: lint, test, build, deploy to Vercel | ADD | `.github/workflows/frontend.yml` |
| 4.3 | Create GitHub Actions workflow for backend | ADD | `.github/workflows/backend.yml` |
| 4.4 | Add steps: lint, test, build Docker, push to ECR, deploy to ECS | ADD | `.github/workflows/backend.yml` |
| 4.5 | Configure GitHub secrets for AWS credentials | SETUP | GitHub Repository Settings |
| 4.6 | Configure GitHub secrets for other environment variables | SETUP | GitHub Repository Settings |
| 4.7 | Test CI/CD pipeline with a test commit | TEST | - |

---

## Day 5 (Friday): Monitoring & Logging

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 5.1 | Set up AWS CloudWatch for backend logs | SETUP | AWS CloudWatch |
| 5.2 | Set up Sentry for error tracking (backend) | ADD | `backend/src/app.ts` |
| 5.3 | Set up Sentry for error tracking (frontend) | ADD | `frontend/app/layout.tsx` |
| 5.4 | Configure uptime monitoring (UptimeRobot or similar) | SETUP | External service |
| 5.5 | Set up alerts for errors and downtime | SETUP | Sentry/CloudWatch |
| 5.6 | Create production environment checklist | DOCUMENT | - |
| 5.7 | Document deployment process | ADD | `DEPLOYMENT.md` |
| 5.8 | Verify all services are running correctly | TEST | - |

---

## Week 23 Checklist

- [ ] Vercel project created
- [ ] Frontend deployed to Vercel
- [ ] Custom domain configured (optional)
- [ ] AWS infrastructure set up
- [ ] Docker image in ECR
- [ ] Backend deployed to ECS/EC2
- [ ] MongoDB Atlas production ready
- [ ] Redis Cloud production ready
- [ ] CI/CD for frontend working
- [ ] CI/CD for backend working
- [ ] Error tracking (Sentry) configured
- [ ] Monitoring configured
- [ ] Deployment documented

---

**Next Week:** Week 24 - Launch Preparation
