# 🔐 Security Policy - EduActive

## ⚠️ Security Notice

**Date:** November 2, 2025  
**Status:** Security vulnerabilities detected and partially fixed

### 🔴 Critical Issues Found

During security audit, the following critical issues were discovered:

1. ❌ **API Keys exposed in source code** (FIXED)
2. ❌ **Weak teacher password** (NEEDS ACTION)
3. ❌ **Sensitive tokens in repository** (NEEDS ACTION)
4. ❌ **Row Level Security disabled** (SQL FILE PROVIDED)

---

## ✅ What Has Been Fixed

### 1. config.js - API Key Removal
- ✅ Removed hardcoded `DEEPSEEK_API_KEY`
- ✅ Now uses `localStorage` for teacher-provided keys
- ✅ Safe to commit to repository

### 2. .gitignore - Enhanced Protection
- ✅ Verified `.env` protection
- ✅ All sensitive files excluded
- ✅ Updated with comments

### 3. Documentation
- ✅ Created comprehensive security guide (Arabic)
- ✅ Created critical fixes checklist (Arabic)
- ✅ Created `.env.example` with instructions

---

## 🔴 Action Required (Within 24 Hours)

### 1. Change Telegram Bot Token

```bash
# Old token has been revoked ✅
# New token is stored securely in functions/.env

# Steps:
1. Open @BotFather on Telegram
2. Send: /mybots
3. Select your bot
4. Click: Revoke Token
5. Copy new token
6. Update in functions/.env
```

### 2. Change DeepSeek API Key

```bash
# Old key has been revoked ✅
# New key is stored securely in functions/.env

# Steps:
1. Visit: https://platform.deepseek.com/api_keys
2. Delete old key
3. Create new key
4. Set spending limit ($10 recommended)
5. Update in functions/.env
```

### 3. Change Teacher Password

```bash
# Old password (WEAK):
TEACHER_PASSWORD=7904

# New password (STRONG):
TEACHER_PASSWORD=YourStrongP@ssw0rd!2025

# Requirements:
- Minimum 12 characters
- Mix of upper/lowercase
- Numbers and symbols
- Not a dictionary word
```

### 4. Optional: Rotate Supabase Service Role Key

⚠️ **WARNING:** This has full database access!

```bash
# Steps:
1. Open Supabase Dashboard
2. Go to: Settings → API
3. Service Role Key → Reset
4. Update in functions/.env

# Note: Only rotate if you're confident
# May break some backend functions
```

---

## 📋 Security Checklist

### Immediate (Today)
- [ ] Read `🔴_إصلاحات_أمنية_حرجة.txt`
- [ ] Change Telegram Bot Token
- [ ] Change DeepSeek API Key
- [ ] Update teacher password
- [ ] Verify `.env` is in `.gitignore`
- [ ] Test all functions after changes

### Important (This Week)
- [ ] Enable Row Level Security (run `ENABLE_ROW_LEVEL_SECURITY.sql`)
- [ ] Review Supabase access logs
- [ ] Set up API usage alerts
- [ ] Create backup before RLS changes

### Recommended (This Month)
- [ ] Implement bcrypt for password hashing
- [ ] Add rate limiting to login
- [ ] Set up automated backups
- [ ] Review all database policies

---

## 🔒 Best Practices Going Forward

### DO ✅
- Keep `.env` files private
- Use strong, unique passwords
- Rotate keys every 3-6 months
- Monitor API usage daily
- Enable 2FA on all services
- Use Service Role Key only in backend
- Review logs regularly

### DON'T ❌
- Never commit `.env` to git
- Never share API keys publicly
- Never use simple passwords
- Never put secrets in frontend code
- Never use Service Role Key in browser
- Never ignore security warnings

---

## 🗄️ Database Security

### Row Level Security (RLS)

**Current Status:** ❌ DISABLED (Dangerous!)

Anyone with `ANON_KEY` can:
- Read all student data
- Modify grades
- Delete records
- Add fake data

**To Enable:**
```sql
-- Run this file in Supabase SQL Editor:
ENABLE_ROW_LEVEL_SECURITY.sql
```

**After Enabling:**
- Students can only see their own data
- Teacher uses Service Role Key (backend only)
- All tables are protected

---

## 📊 Monitoring

### Daily
- [ ] Check Supabase logs
- [ ] Monitor bot activity
- [ ] Review DeepSeek API usage

### Weekly
- [ ] Manual database backup
- [ ] Review access logs
- [ ] Check for unusual requests

### Monthly
- [ ] Review all permissions
- [ ] Update dependencies
- [ ] Security audit
- [ ] Test backup restoration

---

## 🚨 Incident Response

If you discover a breach:

### 1. Immediate (Within Minutes)
- Rotate ALL keys immediately
- Disable affected services
- Disconnect database

### 2. Within 1 Hour
- Review logs to assess damage
- Identify what was accessed
- Restore from clean backup

### 3. Within 24 Hours
- Notify affected users
- Document the incident
- Implement preventive measures

---

## 📞 Contact

For security concerns:
- Do not open public issues
- Contact project maintainer privately
- Provide detailed information

---

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Guide](https://supabase.com/docs/guides/auth)
- [Telegram Bot Security](https://core.telegram.org/bots/security)

---

## 📝 Changelog

### 2025-11-02
- ✅ Fixed `config.js` API key exposure
- ✅ Enhanced `.gitignore` protection
- ✅ Created security documentation
- ✅ Prepared RLS SQL script
- ⚠️ Identified weak passwords
- ⚠️ Identified exposed tokens

---

**Remember:** Security is not a one-time task, it's an ongoing process!

🔐 Stay vigilant. Stay secure.
