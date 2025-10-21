# Vercel Deployment - Environment Variables

## Quick Setup for Vercel

### 1. Navigate to Project Settings
```
Your Project → Settings → Environment Variables
```

### 2. Add These Variables

| Variable Name | Value | Environments |
|--------------|-------|--------------|
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Your Mapbox public token | Production, Preview, Development |
| `NEXT_PUBLIC_API_URL` | Your API endpoint | Production, Preview, Development |
| `NEXTAUTH_SECRET` | Your auth secret | Production, Preview, Development |
| `NEXTAUTH_URL` | Your deployed URL | Production, Preview |

### 3. About the Mapbox Token Warning ⚠️

You will see this warning in Vercel:
```
⚠️ This key, which is prefixed with NEXT_PUBLIC_ and includes the term 
   ACCESS_TOKEN, might expose sensitive information to the browser.
```

**This warning is EXPECTED and SAFE to ignore** because:

✅ Mapbox public tokens are designed for browser use
✅ They are protected by URL restrictions (see below)
✅ The `NEXT_PUBLIC_` prefix is required for client-side usage
✅ This is the official way to use Mapbox with Next.js

### 4. Secure Your Token in Mapbox Dashboard

**CRITICAL:** Go to [Mapbox Account](https://account.mapbox.com/access-tokens/) and add URL restrictions:

**Production URLs:**
```
https://yourdomain.com/*
https://www.yourdomain.com/*
https://your-app.vercel.app/*
```

**Preview URLs (for Vercel preview deployments):**
```
https://*.vercel.app/*
```

### 5. Token Scopes

Ensure your token only has:
- ✅ `styles:read`
- ✅ `fonts:read`
- ✅ `geocoding:read`

Remove all other scopes for maximum security.

---

## Troubleshooting

### Token Not Working
1. Check environment variable name is exactly `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
2. Redeploy after adding environment variables
3. Check browser console for specific error messages

### 403 Forbidden Error
- Your domain is not in the URL restrictions list
- Add your Vercel deployment URL to Mapbox restrictions

### Token Appears as `undefined`
- Missing `NEXT_PUBLIC_` prefix
- Need to redeploy after adding variable
- Clear build cache and redeploy

---

## Security Best Practices

1. ✅ Always set URL restrictions in Mapbox
2. ✅ Use minimal scopes required
3. ✅ Rotate tokens if compromised
4. ✅ Monitor usage in Mapbox dashboard
5. ✅ Keep `.env.local` in `.gitignore`

---

**Remember:** The Vercel warning is informational. Your setup is secure if you follow the URL restriction guidelines above.
