# Generated by Django 5.2.1 on 2025-05-12 14:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='email_verification_code',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='email_verification_code_created_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
