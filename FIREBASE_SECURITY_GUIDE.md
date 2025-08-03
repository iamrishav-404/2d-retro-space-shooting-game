# Firebase Security Guide for Production

## Current Security Risks
Your current test mode rules allow anyone to read, write, and delete ALL data until September 2, 2025. This is extremely dangerous because:

1. **Score Manipulation**: Players can directly insert fake high scores
2. **Data Deletion**: Malicious users can delete all scores
3. **Spam/DoS**: Attackers can flood your database with junk data
4. **Data Mining**: Anyone can access all player data

## Production Security Rules Implementation

### Step 1: Update Firestore Rules
1. Go to Firebase Console → Firestore Database → Rules
2. Replace the current rules with the content from `firestore-security-rules.txt`

### Step 2: Understanding the Security Rules

**What the new rules do:**
- ✅ Allow anyone to READ scores (public leaderboard)
- ✅ Allow CREATE new scores with strict validation
- ❌ DENY updates to existing scores (prevents cheating)
- ❌ DENY deletes (prevents data loss)
- ✅ Validate all data types and constraints
- ✅ Check timestamp is recent (prevents replay attacks)
- ✅ Limit score ranges (prevents unrealistic scores)

**Validation Checks:**
- Player name: 1-20 characters, string type
- Score: 0-10,000,000 points, number type
- Timestamp: Must be within last 5 minutes
- Game version: Must match "1.0"

### Step 3: Additional Security Measures

#### Client-Side Protection (Already Implemented)
Your `scoreService.js` already includes:
- Input validation
- Data sanitization
- Error handling
- Game version tracking

#### Server-Side Protection (Rules Level)
The Firestore rules provide:
- Schema validation
- Type checking
- Range validation
- Timestamp verification
- Immutable records

### Step 4: Monitoring and Analytics

1. **Enable Security Rules Debugging**
   - Firebase Console → Firestore → Rules → Simulator
   - Test your rules with sample data

2. **Monitor Failed Requests**
   - Firebase Console → Firestore → Usage
   - Watch for permission-denied errors

3. **Set up Alerts**
   - Cloud Monitoring for unusual activity
   - Budget alerts for unexpected costs

### Step 5: Advanced Security (Optional)

For even stronger security, consider:

1. **Rate Limiting**: Limit submissions per IP/user
2. **Server-Side Validation**: Use Cloud Functions
3. **Authentication**: Require user sign-in
4. **Encryption**: Encrypt sensitive data
5. **Backup Strategy**: Regular automated backups

## Testing Your Security Rules

### Test Cases to Run:

1. **Valid Score Submission** ✅
   ```javascript
   // Should succeed
   {
     playerName: "TestPlayer",
     score: 1500,
     timestamp: new Date().toISOString(),
     gameVersion: "1.0"
   }
   ```

2. **Invalid Data Types** ❌
   ```javascript
   // Should fail
   {
     playerName: 123, // Wrong type
     score: "high", // Wrong type
     timestamp: new Date().toISOString(),
     gameVersion: "1.0"
   }
   ```

3. **Score Too High** ❌
   ```javascript
   // Should fail
   {
     playerName: "Cheater",
     score: 99999999, // Too high
     timestamp: new Date().toISOString(),
     gameVersion: "1.0"
   }
   ```

4. **Old Timestamp** ❌
   ```javascript
   // Should fail - replay attack
   {
     playerName: "TestPlayer",
     score: 1500,
     timestamp: "2024-01-01T00:00:00Z", // Too old
     gameVersion: "1.0"
   }
   ```

5. **Update Attempt** ❌
   ```javascript
   // Should fail - no updates allowed
   await updateDoc(docRef, { score: 9999999 });
   ```

## Emergency Procedures

If you detect an attack:

1. **Immediate Response**
   - Disable rules temporarily (deny all writes)
   - Check for malicious data
   - Review access logs

2. **Data Cleanup**
   - Remove fake/spam entries
   - Restore from backup if needed
   - Update rules if new vulnerabilities found

3. **Investigation**
   - Check Firebase logs
   - Identify attack patterns
   - Update security measures

## Cost Management

These rules also help control costs by:
- Preventing spam submissions
- Limiting data size
- Blocking bulk operations
- Ensuring only legitimate game data

## Deployment Checklist

Before going live:
- [ ] Rules deployed and tested
- [ ] Test all game functions work
- [ ] Monitor dashboard set up
- [ ] Backup strategy in place
- [ ] Team trained on security procedures
- [ ] Emergency response plan ready

Remember: Security is ongoing! Regularly review and update your rules as your game evolves.
