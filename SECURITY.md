# Security Checklist

## Authentication & Authorization
- [ ] Implement JWT authentication
- [ ] Add role-based access control (RBAC)
- [ ] Secure password hashing with bcrypt
- [ ] Implement refresh token rotation

## Data Protection
- [ ] Encrypt sensitive data in transit (HTTPS)
- [ ] Encrypt sensitive data at rest
- [ ] Implement field-level encryption for PII
- [ ] Add database backup encryption

## API Security
- [ ] Implement rate limiting
- [ ] Add CORS configuration
- [ ] Input validation and sanitization
- [ ] SQL injection prevention (using ORM)
- [ ] XSS protection
- [ ] CSRF token implementation

## Infrastructure
- [ ] Environment variable management (.env)
- [ ] Security headers (Helmet.js)
- [ ] Dependency vulnerability scanning
- [ ] Regular security audits

## Compliance
- [ ] GDPR compliance for EU users
- [ ] Data retention policies
- [ ] Privacy policy and terms
- [ ] Audit logging for sensitive operations
