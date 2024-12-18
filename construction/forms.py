from django import forms
from django.contrib.auth.forms import AuthenticationForm


class CustomLoginForm(AuthenticationForm):
    username = forms.CharField(label="Имя пользователя", max_length=30,
                               widget=forms.TextInput(
                                   attrs={'class': 'form-control', 'placeholder': 'Имя пользователя'}))
    password = forms.CharField(label="Пароль", max_length=30,
                               widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Пароль'}))
