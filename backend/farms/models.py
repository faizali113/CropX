from django.db import models
from django.conf import settings


class Farm(models.Model):
    SOIL_CHOICES = [
        ('CLAY', 'Clay'), ('SANDY', 'Sandy'), ('LOAMY', 'Loamy'),
        ('SILT', 'Silt'), ('PEATY', 'Peaty'), ('CHALKY', 'Chalky'), ('OTHER', 'Other'),
    ]
    IRRIGATION_CHOICES = [
        ('DRIP', 'Drip'), ('SPRINKLER', 'Sprinkler'), ('FLOOD', 'Flood'),
        ('RAINFED', 'Rainfed'), ('CANAL', 'Canal'), ('BOREWELL', 'Borewell'),
    ]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='farms')
    name = models.CharField(max_length=200)
    farm_code = models.CharField(max_length=20, unique=True, blank=True)
    image = models.ImageField(upload_to='farms/', null=True, blank=True)

    # Location
    village = models.CharField(max_length=100, blank=True)
    taluka = models.CharField(max_length=100, blank=True)
    district = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    pin_code = models.CharField(max_length=10, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    # Specifications
    area_acres = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    soil_type = models.CharField(max_length=20, choices=SOIL_CHOICES, default='LOAMY')
    irrigation_type = models.CharField(max_length=20, choices=IRRIGATION_CHOICES, default='DRIP')
    water_source = models.CharField(max_length=100, blank=True)

    # Meta
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.owner.email})"

    def save(self, *args, **kwargs):
        if not self.farm_code:
            import random, string
            self.farm_code = 'FRM-' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        super().save(*args, **kwargs)


class Crop(models.Model):
    STAGE_CHOICES = [
        ('SOWING', 'Sowing'), ('GERMINATION', 'Germination'), ('VEGETATIVE', 'Vegetative'),
        ('FLOWERING', 'Flowering'), ('FRUITING', 'Fruiting'), ('MATURITY', 'Maturity'),
        ('HARVESTED', 'Harvested'),
    ]
    HEALTH_CHOICES = [
        ('EXCELLENT', 'Excellent'), ('GOOD', 'Good'), ('FAIR', 'Fair'),
        ('POOR', 'Poor'), ('CRITICAL', 'Critical'),
    ]

    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='crops')
    name = models.CharField(max_length=100)
    variety = models.CharField(max_length=100, blank=True)
    image = models.ImageField(upload_to='crops/', null=True, blank=True)
    sowing_date = models.DateField(null=True, blank=True)
    expected_harvest = models.DateField(null=True, blank=True)
    current_stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='SOWING')
    health_status = models.CharField(max_length=20, choices=HEALTH_CHOICES, default='GOOD')
    area_acres = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    expected_yield_kg = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.farm.name}"


class MarketListing(models.Model):
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'), ('ACTIVE', 'Active'), ('SOLD', 'Sold'), ('EXPIRED', 'Expired'),
    ]

    farmer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='listings')
    crop = models.ForeignKey(Crop, on_delete=models.SET_NULL, null=True, blank=True)
    crop_name = models.CharField(max_length=100)
    variety = models.CharField(max_length=100, blank=True)
    image = models.ImageField(upload_to='listings/', null=True, blank=True)
    quantity_kg = models.DecimalField(max_digits=10, decimal_places=2)
    price_per_kg = models.DecimalField(max_digits=8, decimal_places=2)
    harvest_date = models.DateField(null=True, blank=True)
    is_organic = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='DRAFT')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.crop_name} - {self.quantity_kg}kg @ ₹{self.price_per_kg}"


class Order(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'), ('ACCEPTED', 'Accepted'), ('PACKED', 'Packed'),
        ('IN_TRANSIT', 'In Transit'), ('DELIVERED', 'Delivered'), ('CANCELLED', 'Cancelled'),
    ]
    PAYMENT_CHOICES = [
        ('PENDING', 'Pending'), ('PAID', 'Paid'), ('FAILED', 'Failed'), ('REFUNDED', 'Refunded'),
    ]

    order_id = models.CharField(max_length=20, unique=True, blank=True)
    listing = models.ForeignKey(MarketListing, on_delete=models.SET_NULL, null=True)
    farmer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='farmer_orders')
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='customer_orders')
    crop_name = models.CharField(max_length=100)
    quantity_kg = models.DecimalField(max_digits=10, decimal_places=2)
    price_per_kg = models.DecimalField(max_digits=8, decimal_places=2)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    delivery_address = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='PENDING')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.order_id:
            import random
            self.order_id = f"ORD-{random.randint(100000, 999999)}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.order_id} - {self.crop_name}"


class DiseaseRecord(models.Model):
    SEVERITY_CHOICES = [
        ('LOW', 'Low'), ('MEDIUM', 'Medium'), ('HIGH', 'High'), ('CRITICAL', 'Critical'),
    ]

    farmer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='disease_scans')
    crop = models.ForeignKey(Crop, on_delete=models.SET_NULL, null=True, blank=True)
    image = models.ImageField(upload_to='disease_scans/')
    disease_name = models.CharField(max_length=200, blank=True)
    confidence = models.FloatField(default=0)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, blank=True)
    symptoms = models.TextField(blank=True)
    causes = models.TextField(blank=True)
    prevention = models.TextField(blank=True)
    organic_treatment = models.TextField(blank=True)
    chemical_treatment = models.TextField(blank=True)
    scan_status = models.CharField(max_length=20, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.disease_name or 'Pending'} - {self.farmer.email}"


class MarketPrice(models.Model):
    TREND_CHOICES = [('UP', 'Up'), ('DOWN', 'Down'), ('STABLE', 'Stable')]

    crop_name = models.CharField(max_length=100)
    market_name = models.CharField(max_length=200)
    state = models.CharField(max_length=100)
    district = models.CharField(max_length=100, blank=True)
    price_per_quintal = models.DecimalField(max_digits=10, decimal_places=2)
    min_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    max_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    trend = models.CharField(max_length=10, choices=TREND_CHOICES, default='STABLE')
    change_percent = models.FloatField(default=0)
    recorded_date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.crop_name} - {self.market_name} @ ₹{self.price_per_quintal}"


class Message(models.Model):
    """Direct messages between any two users (farmer ↔ customer)."""
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages'
    )
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_messages'
    )
    body = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.sender.email} → {self.recipient.email}: {self.body[:40]}"


class Notification(models.Model):
    TYPE_CHOICES = [
        ('ORDER', 'Order'), ('WEATHER', 'Weather'), ('MARKET', 'Market'),
        ('DISEASE', 'Disease'), ('SYSTEM', 'System'), ('AI', 'AI Insight'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='SYSTEM')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.notification_type}: {self.title}"
