# Tournament Database Schema

This document outlines the database schema requirements for the Tournament feature based on the frontend implementation in the amateur player project.

## Frontend Analysis Summary

The tournament page includes:
- Tournament listing with filtering capabilities
- Tab-based navigation (All Tournament, Registered, Cancelled)
- Advanced filtering by content type, access level, duration, and upload date
- Tournament cards with detailed information
- Registration management

## Database Schema

### 1. Tournaments Table

```sql
CREATE TABLE tournaments (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    type VARCHAR(100) NOT NULL,
    registration_deadline DATE NOT NULL,
    status ENUM('active', 'premium', 'cancelled') DEFAULT 'active',
    category ENUM('Singles', 'Doubles', 'Team') NOT NULL,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INTEGER,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### 2. Tournament Registrations Table

```sql
CREATE TABLE tournament_registrations (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    tournament_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('registered', 'cancelled', 'waitlist') DEFAULT 'registered',
    payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    team_name VARCHAR(255), -- For team tournaments
    partner_user_id INTEGER, -- For doubles tournaments
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (partner_user_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_tournament (tournament_id, user_id)
);
```

### 3. Tournament Categories Table (Optional - for extensibility)

```sql
CREATE TABLE tournament_categories (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO tournament_categories (name, description) VALUES
('Singles', 'Individual player tournaments'),
('Doubles', 'Two-player team tournaments'),
('Team', 'Multi-player team tournaments');
```

### 4. Tournament Types Table (Optional - for extensibility)

```sql
CREATE TABLE tournament_types (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default types
INSERT INTO tournament_types (name, description) VALUES
('Singles', 'Standard singles tournament'),
('Doubles', 'Standard doubles tournament'),
('Team', 'Team-based tournament'),
('Pro-Am', 'Professional and amateur mixed tournament'),
('Senior', 'Senior league tournament');
```

## API Endpoints Required

### 1. Get Tournaments (with filtering)

```
GET /api/tournaments/
```

**Query Parameters:**
- `status` (optional): Filter by tournament status (active, premium, cancelled)
- `category` (optional): Filter by category (Singles, Doubles, Team)
- `type` (optional): Filter by type (Singles, Doubles, Team, Pro-Am, Senior)
- `price_max` (optional): Filter tournaments under specified price
- `registration_status` (optional): Filter by user's registration status (registered, not_registered)
- `search` (optional): Search in title and location
- `page` (optional): Page number for pagination
- `limit` (optional): Number of results per page

**Response:**
```json
{
    "count": 50,
    "next": "http://api.example.com/tournaments/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "title": "City Championship",
            "location": "Downtown Lanes, New York, NY",
            "date": "2025-05-15",
            "price": "85.00",
            "type": "Singles",
            "registration_deadline": "2025-05-10",
            "status": "premium",
            "category": "Singles",
            "max_participants": 50,
            "current_participants": 23,
            "is_registered": false,
            "registration_status": null,
            "can_register": true,
            "created_at": "2025-01-15T10:30:00Z"
        }
    ]
}
```

### 2. Get Tournament Details

```
GET /api/tournaments/{id}/
```

**Response:**
```json
{
    "id": 1,
    "title": "City Championship",
    "description": "Annual city bowling championship for all skill levels",
    "location": "Downtown Lanes, New York, NY",
    "date": "2025-05-15",
    "price": "85.00",
    "type": "Singles",
    "registration_deadline": "2025-05-10",
    "status": "premium",
    "category": "Singles",
    "max_participants": 50,
    "current_participants": 23,
    "is_registered": false,
    "registration_status": null,
    "can_register": true,
    "created_at": "2025-01-15T10:30:00Z",
    "participants": [
        {
            "user_id": 123,
            "name": "John Doe",
            "registration_date": "2025-01-20T14:30:00Z"
        }
    ]
}
```

### 3. Register for Tournament

```
POST /api/tournaments/{id}/register/
```

**Request Body:**
```json
{
    "team_name": "Team Thunder", // Optional, for team tournaments
    "partner_user_id": 456, // Optional, for doubles tournaments
    "notes": "Special dietary requirements" // Optional
}
```

**Response:**
```json
{
    "success": true,
    "message": "Successfully registered for tournament",
    "registration": {
        "id": 789,
        "tournament_id": 1,
        "user_id": 123,
        "status": "registered",
        "registration_date": "2025-01-25T10:30:00Z"
    }
}
```

### 4. Cancel Tournament Registration

```
DELETE /api/tournaments/{id}/register/
```

**Response:**
```json
{
    "success": true,
    "message": "Registration cancelled successfully"
}
```

### 5. Get User's Tournament Registrations

```
GET /api/user/tournaments/
```

**Query Parameters:**
- `status` (optional): Filter by registration status (registered, cancelled)

**Response:**
```json
{
    "count": 10,
    "results": [
        {
            "registration_id": 789,
            "tournament": {
                "id": 1,
                "title": "City Championship",
                "location": "Downtown Lanes, New York, NY",
                "date": "2025-05-15",
                "status": "premium"
            },
            "registration_status": "registered",
            "registration_date": "2025-01-25T10:30:00Z"
        }
    ]
}
```

## Frontend Filter Mapping

### Content Type Filter
Maps to `category` field in database:
- Singles → Singles
- Doubles → Doubles  
- Team → Team
- Pro-Am → Pro-Am (stored in `type` field)
- Senior → Senior (stored in `type` field)

### Access Level Filter
Maps to `price` field:
- "Under $50" → WHERE price < 50
- "Any" → No price filter

### Tab Navigation
- "All Tournament" → All tournaments regardless of user's registration status
- "Registered" → Tournaments where current user has active registration
- "Cancelled" → Tournaments where current user has cancelled registration

## Django Models Example

```python
from django.db import models
from django.contrib.auth.models import User

class Tournament(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('premium', 'Premium'),
        ('cancelled', 'Cancelled'),
    ]
    
    CATEGORY_CHOICES = [
        ('Singles', 'Singles'),
        ('Doubles', 'Doubles'),
        ('Team', 'Team'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=255)
    date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=100)
    registration_deadline = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    max_participants = models.IntegerField(null=True, blank=True)
    current_participants = models.IntegerField(default=0)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tournaments')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class TournamentRegistration(models.Model):
    STATUS_CHOICES = [
        ('registered', 'Registered'),
        ('cancelled', 'Cancelled'),
        ('waitlist', 'Waitlist'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('refunded', 'Refunded'),
    ]
    
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='registrations')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tournament_registrations')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='registered')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    team_name = models.CharField(max_length=255, blank=True)
    partner_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='partner_registrations')
    notes = models.TextField(blank=True)
    registration_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['tournament', 'user']
```

## Additional Considerations

1. **Permissions**: Implement proper user authentication and permissions for tournament registration
2. **Payment Integration**: Consider payment gateway integration for tournament fees
3. **Notifications**: Email/SMS notifications for registration confirmations, cancellations, and tournament updates
4. **Capacity Management**: Automatic waitlist management when tournaments reach capacity
5. **Search**: Implement full-text search on tournament titles and descriptions
6. **Caching**: Cache tournament listings for better performance
7. **Audit Trail**: Track all registration changes for administrative purposes

This schema should provide all the necessary data structure to support the tournament page functionality shown in the frontend implementation.
