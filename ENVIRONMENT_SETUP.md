# Environment Variables Setup Guide

## 🔐 Mapbox Token Security

### Understanding Mapbox Public Tokens

The `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` is a **public token** that is:
- ✅ **Safe to expose** in client-side code
- ✅ **Designed** to be used in browsers
- ✅ **Protected** by URL restrictions in Mapbox dashboard

### Why Vercel Shows a Warning

Vercel shows a warning for any `NEXT_PUBLIC_*` variables because they're exposed to the browser. However, for Mapbox public tokens, this is **intentional and secure** when properly configured.

## 🛡️ Securing Your Mapbox Token

### 1. Set URL Restrictions (REQUIRED)

Go to your [Mapbox Account Tokens](https://account.mapbox.com/access-tokens/) and add URL restrictions:

**For Development:**
```
http://localhost:*
http://127.0.0.1:*
```

**For Production:**
```
https://yourdomain.com/*
https://www.yourdomain.com/*
https://your-vercel-app.vercel.app/*
```

### 2. Token Scopes

Ensure your public token only has these scopes:
- ✅ `styles:read`
- ✅ `fonts:read`
- ✅ `geocoding:read`
- ❌ Remove any write/admin scopes

### 3. Rotate Tokens Regularly

If you suspect token exposure:
1. Create a new public token
2. Update `.env.local` and Vercel environment variables
3. Delete the old token from Mapbox dashboard

## 📝 Setup Instructions

### Local Development

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your actual token:
   ```env
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1Ij...your-actual-token
   ```

3. **Never commit** `.env.local` to git (already in `.gitignore`)

### Vercel Deployment

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` with your token
4. Set it for **Production**, **Preview**, and **Development** environments
5. Click **Save**

### Dismissing Vercel Warning

The warning in Vercel is informational only. Since this is a **public token** with URL restrictions:

1. ✅ The warning is expected behavior
2. ✅ Your token is secure if URL-restricted
3. ✅ You can safely ignore this specific warning
4. ✅ Add a note in your team documentation

## 🚀 Verification

Test that your token is working:

```javascript
// This should work in browser console on your site
fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/New%20York.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`)
  .then(r => r.json())
  .then(console.log)
```

## 📋 Best Practices Checklist

- [ ] `.env.local` is in `.gitignore`
- [ ] URL restrictions are configured in Mapbox
- [ ] Token has minimal required scopes
- [ ] `.env.example` exists for team reference
- [ ] Production environment variables set in Vercel
- [ ] Team is aware that Vercel warning is expected
- [ ] Documentation includes security notes

## 🔗 Helpful Links

- [Mapbox Token Documentation](https://docs.mapbox.com/help/getting-started/access-tokens/)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)

## ⚠️ Important Notes

1. **Public tokens are MEANT to be public** - they're different from secret keys
2. **URL restrictions are your primary security** - always configure them
3. **The `NEXT_PUBLIC_` prefix is correct** - it's needed for client-side usage
4. **Vercel's warning is informational** - it doesn't mean you have a security issue
5. **Never use a secret token** with `NEXT_PUBLIC_` prefix

---

**TL;DR:** The Vercel warning is expected. Your Mapbox public token is secure as long as you have URL restrictions configured in your Mapbox dashboard. This is the correct way to use Mapbox in Next.js client-side code.
