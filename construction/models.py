from django.db import models

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError
from encrypted_model_fields.fields import EncryptedCharField


class Role(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class User(AbstractUser):
    role = models.ForeignKey(Role, on_delete=models.CASCADE, null=True, blank=True)

    username = models.CharField(max_length=50, unique=True, default='guest')

    def has_permission(self, permission):
        """Проверка наличия прав у пользователя."""
        return self.role.name == permission

    def clean(self):
        """Проверка сложности пароля."""
        if len(self.password) < 8:
            raise ValidationError("Пароль должен содержать не менее 8 символов.")
        if not any(char.isdigit() for char in self.password):
            raise ValidationError("Пароль должен содержать хотя бы одну цифру.")
        if not any(char.isupper() for char in self.password):
            raise ValidationError("Пароль должен содержать хотя бы одну заглавную букву.")

    def __str__(self):
        return self.username


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = EncryptedCharField(max_length=50)
    last_name = EncryptedCharField(max_length=50)
    age = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class ResourceType(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Resource(models.Model):
    name = models.CharField(max_length=255)
    resource_type = models.ForeignKey(ResourceType, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Project(models.Model):
    name = models.CharField(max_length=255)
    client = models.CharField(max_length=255)
    budget = models.DecimalField(max_digits=15, decimal_places=2)
    status = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Stage(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Task(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    stage = models.ForeignKey(Stage, on_delete=models.CASCADE)
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, null=True,
                                    blank=True)  # Рабочий, которому назначена задача
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class MaterialDistribution(models.Model):
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE)
    stage = models.ForeignKey(Stage, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    distribution_date = models.DateField()
    cost = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.resource} for {self.stage}"


class Finance(models.Model):
    transaction_type = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    transaction_date = models.DateField()
    description = models.TextField()
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.transaction_type} - {self.amount}"


class ActionLog(models.Model):
    LEVEL_CHOICES = [
        ('INFO', 'Info'),
        ('DEBUG', 'Debug'),
        ('WARNING', 'Warning'),
        ('ERROR', 'Error'),
        ('CRITICAL', 'Critical'),
    ]

    level = models.CharField(
        max_length=10,
        choices=LEVEL_CHOICES,
        default='INFO',  # Default value added here
    )
    action = models.TextField()
    action_date = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.level}: {self.action} at {self.action_date}"


class TaskReport(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    report = models.TextField()
    submitted_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Report for {self.task}"
