from django.db import models


class Donation(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    amount_cents = models.PositiveIntegerField()
    name = models.CharField(max_length=120, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=40, blank=True)
    stripe_session_id = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=32, default='created')  # created|paid|canceled|expired

    def amount_display(self):
        return f"${self.amount_cents/100:,.2f}"
